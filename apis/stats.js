// const borrowerSchema = require("../db/models/borrowerWeeklySchema");
// const moment = require("moment/moment");

// module.exports = function (fastify, _, done) {
//   fastify.get("/getStatsAPI/:startDate/:endDate", async (req, _) => {
//     const { startDate, endDate } = req.params;

//     const start = moment(startDate)
//       .startOf("day")
//       .add(1, "second")
//       .format("YYYY-MM-DD HH:mm:ss");

//     const end = moment(endDate)
//       .endOf("day")
//       .subtract(1, "second")
//       .format("YYYY-MM-DD HH:mm:ss");

//     const statistics = await borrowerSchema.aggregate([
//       {
//         $match: {
//           createdAt: {
//             $gte: start,
//             $lte: end,
//           },
//         },
//       },
//       {
//         $addFields: {
//           balanceAmount: { $subtract: ["$totalAmount", "$amountPaid"] },
//           isAccountClosed: {
//             $and: [
//               { $eq: ["$balanceAmount", 0] },
//               { $eq: ["$totalAmount", "$amountPaid"] },
//             ],
//           },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalBorrowers: { $sum: 1 },
//           totalLoanAmount: { $sum: "$totalAmount" },
//           totalAmountPaid: { $sum: "$amountPaid" },
//           totalPaidBorrowers: { $sum: { $cond: ["$isPaid", 1, 0] } },
//           totalUnpaidBorrowers: { $sum: { $cond: ["$isPaid", 0, 1] } },
//           totalUnpaidAmount: {
//             $sum: { $cond: ["$isPaid", 0, "$totalAmount"] },
//           },
//           totalPaidAmount: { $sum: { $cond: ["$isPaid", "$totalAmount", 0] } },
//           totalClosedAccounts: {
//             $sum: { $cond: ["$isAccountClosed", 1, 0] },
//           },
//         },
//       },
//     ]);

//     const statisticsGroup = await borrowerSchema.aggregate([
//       {
//         $match: {
//           createdAt: {
//             $gte: start,
//             $lte: end,
//           },
//         },
//       },
//       {
//         $addFields: {
//           balanceAmount: { $subtract: ["$totalAmount", "$amountPaid"] },
//           isAccountClosed: {
//             $and: [
//               { $eq: ["$balanceAmount", 0] },
//               { $eq: ["$totalAmount", "$amountPaid"] },
//             ],
//           },
//           isPaid: { $gt: ["$amountPaid", 0] },
//         },
//       },
//       {
//         $facet: {
//           paid: [
//             { $match: { isPaid: true } },
//             {
//               $group: {
//                 _id: null,
//                 totalBorrowers: { $sum: 1 },
//                 totalLoanAmount: { $sum: "$totalAmount" },
//                 totalAmountPaid: { $sum: "$amountPaid" },
//                 borrowers: { $push: "$$ROOT" },
//               },
//             },
//             { $project: { _id: 0 } },
//           ],
//           unpaid: [
//             { $match: { isPaid: false } },
//             {
//               $group: {
//                 _id: null,
//                 totalBorrowers: { $sum: 1 },
//                 totalLoanAmount: { $sum: "$totalAmount" },
//                 totalAmountPaid: { $sum: "$amountPaid" },
//                 borrowers: { $push: "$$ROOT" },
//               },
//             },
//             { $project: { _id: 0 } },
//           ],
//           closedAccounts: [
//             { $match: { isAccountClosed: true } },
//             {
//               $group: {
//                 _id: null,
//                 totalBorrowers: { $sum: 1 },
//                 totalLoanAmount: { $sum: "$totalAmount" },
//                 totalAmountPaid: { $sum: "$amountPaid" },
//                 borrowers: { $push: "$$ROOT" },
//               },
//             },
//             { $project: { _id: 0 } },
//           ],
//         },
//       },
//     ]);
//     console.log(statistics);

//     statistics[0].totalPaidBorrowers = statisticsGroup[0].paid.length
//       ? statisticsGroup[0].paid.length
//       : 0;
//     statistics[0].totalUnpaidBorrowers = statisticsGroup[0].unpaid.length
//       ? statisticsGroup[0].unpaid.length
//       : 0;
//     return {
//       message: "Stats fetched successfully",
//       stats: statistics,
//       group: {
//         paid: statisticsGroup[0].paid[0] || {
//           totalBorrowers: 0,
//           totalLoanAmount: 0,
//           totalAmountPaid: 0,
//           borrowers: [],
//         },
//         unpaid: statisticsGroup[0].unpaid[0] || {
//           totalBorrowers: 0,
//           totalLoanAmount: 0,
//           totalAmountPaid: 0,
//           borrowers: [],
//         },
//         closedAccounts: statisticsGroup[0].closedAccounts[0] || {
//           totalBorrowers: 0,
//           totalLoanAmount: 0,
//           totalAmountPaid: 0,
//           borrowers: [],
//         },
//       },
//     };
//   });

//   done();
// };

const borrowerSchema = require("../db/models/borrowerWeeklySchema");
const moment = require("moment/moment");

module.exports = function (fastify, _, done) {
  fastify.get("/getStatsAPI/:startDate/:endDate", async (req, _) => {
    const { startDate, endDate } = req.params;

    const start = moment(startDate)
      .startOf("day")
      .add(1, "second")
      .format("YYYY-MM-DD HH:mm:ss");

    const end = moment(endDate)
      .endOf("day")
      .subtract(1, "second")
      .format("YYYY-MM-DD HH:mm:ss");

    const today = moment().format("YYYY-MM-DD");

    const borrowers = await borrowerSchema.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    let totalBorrowers = 0;
    let totalLoanAmount = 0;
    let totalAmountPaid = 0;
    let totalPaidBorrowers = 0;
    let totalUnpaidBorrowers = 0;
    let totalUnpaidAmount = 0;
    let totalPaidAmount = 0;
    let totalClosedAccounts = 0;

    const paidBorrowers = [];
    const unpaidBorrowers = [];
    const closedAccounts = [];
    const totalAccounts = [];

    borrowers.forEach((borrower) => {
      totalAccounts.push(borrower);

      const balanceAmount = borrower.totalAmount - borrower.amountPaid;
      const isAccountClosed =
        balanceAmount === 0 && borrower.totalAmount === borrower.amountPaid;
      const isPaid = borrower.amountPaid >= 0;

      totalBorrowers += 1;
      totalLoanAmount += borrower.totalAmount;
      totalAmountPaid += borrower.amountPaid;

      if (isPaid && !isAccountClosed) {
        const hasPaidToday = borrower.amountSettled.some(
          (data) => moment(data.date).format("YYYY-MM-DD") === today
        );
        if (hasPaidToday) {
          paidBorrowers.push(borrower);
          totalPaidBorrowers += 1;
          totalPaidAmount += borrower.totalAmount;
        } else {
          totalUnpaidBorrowers += 1;
          totalUnpaidAmount += borrower.totalAmount;

          unpaidBorrowers.push(borrower);
        }
      }

      if (isAccountClosed) {
        totalClosedAccounts += 1;
        closedAccounts.push(borrower);
      }
    });
    return {
      message: "Stats fetched successfully",

      stats: [
        {
          totalBorrowers: totalBorrowers,
          totalLoanAmount: totalLoanAmount,
          totalAmountPaid: totalAmountPaid,
          totalPaidBorrowers: totalPaidBorrowers,
          totalUnpaidBorrowers: totalUnpaidBorrowers,
          totalUnpaidAmount: totalUnpaidAmount,
          totalPaidAmount: totalPaidAmount,
          totalClosedAccounts: totalClosedAccounts,
        },
      ],

      group: {
        paid: {
          totalBorrowers: paidBorrowers.length,
          totalLoanAmount: paidBorrowers.reduce(
            (sum, b) => sum + b.totalAmount,
            0
          ),
          totalAmountPaid: paidBorrowers.reduce(
            (sum, b) => sum + b.amountPaid,
            0
          ),
          borrowers: paidBorrowers,
        },
        unpaid: {
          totalBorrowers: unpaidBorrowers.length,
          totalLoanAmount: unpaidBorrowers.reduce(
            (sum, b) => sum + b.totalAmount,
            0
          ),
          totalAmountPaid: unpaidBorrowers.reduce(
            (sum, b) => sum + b.amountPaid,
            0
          ),
          borrowers: unpaidBorrowers,
        },
        closedAccounts: {
          totalBorrowers: closedAccounts.length,
          totalLoanAmount: closedAccounts.reduce(
            (sum, b) => sum + b.totalAmount,
            0
          ),
          totalAmountPaid: closedAccounts.reduce(
            (sum, b) => sum + b.amountPaid,
            0
          ),
          borrowers: closedAccounts,
        },

        totalBorrowers: {
          totalBorrowers: totalAccounts.length,
          totalLoanAmount: totalAccounts.reduce(
            (sum, b) => sum + b.totalAmount,
            0
          ),
          totalAmountPaid: totalAccounts.reduce(
            (sum, b) => sum + b.amountPaid,
            0
          ),
          borrowers: totalAccounts,
        },

      },
    };
  });

  done();
};
