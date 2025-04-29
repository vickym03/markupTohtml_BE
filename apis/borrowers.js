const {
  saveData,
  findData,
  getAllPagination,
  updateSettledData,
} = require("../db/services");
const borrowerSchema = require("../db/models/borrowerWeeklySchema");

module.exports = function (fastify, _, done) {
  fastify.post("/addBorrowerAPI", async (req, _) => {
    const { data } = req.body;

    data.amountPaid = 0;
    const findBorrower = await findData(
      {
        mobileNumber: data.mobileNumber,
        oldAccountNumber: data.oldAccountNumber,
      },
      borrowerSchema
    );
    console.log("findBorrower", findBorrower);
    if (findBorrower.data.length > 0)
      return {
        message: "Borrower already exists",
        exists: findBorrower.success,
        data: {
          name: data.name,
          mobileNumber: data.mobileNumber,
          oldAccountNumber: data.oldAccountNumber,
        },
      };

    const result = await saveData(data, borrowerSchema);
    console.log(result);
    if (result.success) {
      return {
        message: "Borrower added successfully",
        insertedId: result.insertedId,
        saved: true,
      };
    } else {
      return {
        message: "Borrower added failed",
        saved: false,
      };
    }
  });

  fastify.get("/getBorrowerDataAPI/:limit/:page", async (req, _) => {
    const { limit, page } = req.params;
    const result = await getAllPagination(
      borrowerSchema,
      parseInt(limit),
      parseInt(page)
    );

    // const result1 =
    //   get.data.length > 0
    //     ? get.data.map((item) => {
    //         if (
    //           item.balanceAmount === 0 &&
    //           item.totalAmount === item.amountPaid
    //         ) {
    //           return { ...item, status: "Paid" };
    //         }
    //       })
    //     : [];

    return { message: "Borrower data fetched successfully", data: result.data };
  });

  fastify.get("/findBorrowerAPI/:id/:search", async (req, _) => {
    const { id, search } = req.params;

    let searchTerm;

    if (search === "mobileNumber") searchTerm = { mobileNumber: id };
    else if (search === "accountNumber") searchTerm = { accountNumber: id };
    else searchTerm = { name: id };
    console.log(searchTerm);
    const result = await findData(searchTerm, borrowerSchema);

    if (result.success)
      return {
        message: "Borrower data fetched successfully",
        data: result.data,
      };
    else return { message: "Borrower not found", data: false };
  });

  fastify.post("/updateBorrowerAmt", async (req, _) => {
    const { id, amountSettled } = req.body;

    if (!id || !amountSettled) {
      return {
        success: false,
        message: "Invalid request. 'id' and 'update' are required.",
      };
    }

    const result = await updateSettledData(id, amountSettled, borrowerSchema);

    if (result.success) {
      return {
        update: true,
        message: result.message,
      };
    } else {
      return {
        update: false,
        message: "update failed",
      };
    }
  });

  done();
};
