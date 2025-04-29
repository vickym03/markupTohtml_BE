const moment = require("moment/moment");

async function saveData(data, schema) {
  try {
    data.createdAt = moment().format("YYYY-MM-DD hh:mm:ss");
    data.modifiedAt = moment().format("YYYY-MM-DD hh:mm:ss");
    const borrower = new schema(data);
    const result = await borrower.save();
    return { success: true, insertedId: result._id };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

async function getAllPagination(schema, limit, currentPage) {
  const offset = (currentPage - 1) * limit;

  try {
    const borrowers = await schema.find().skip(offset).limit(limit);
    return { success: true, data: borrowers };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
async function findData(id, schema) {
  try {
    const borrower = await schema.find(id);
    if (!borrower) {
      return { success: false, message: "Borrower not found" };
    }
    return { success: true, data: borrower };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

async function updateSettledData(id, update, schema) {
  console.log("update", update);
  try {
    const checkData = await findDataById(id, schema);

    if (
      checkData.data.balanceAmount === 0 &&
      checkData.data.totalAmount === checkData.data.amountPaid
    ) {
      return { success: true, message: "Borrower already paid" };
    }

    const result = await schema.findByIdAndUpdate(
      id,
      { $push: { amountSettled: update } },
      { new: true }
    );

    if (!result) {
      return { success: false, message: "Borrower not found" };
    }
    const updatedData = await findDataById(id, schema);

    if (!updatedData.success) {
      return { success: false, message: updatedData.message };
    }

    const borrower = updatedData.data;

    const totalSettled = borrower.amountSettled.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );

    const newBalance = borrower.totalAmount - totalSettled;

    borrower.balanceAmount = newBalance;

    const finalResult = await schema.findByIdAndUpdate(
      id,
      {
        balanceAmount: newBalance,
        amountPaid: totalSettled,
        modifiedAt: update[0].date,
      },
      { new: true }
    );

console.log(finalResult);console.log("k",  {
  balanceAmount: newBalance,
  amountPaid: totalSettled,
  modifiedAt: update[0].date
},);

    return { success: true, message: "updated succesfuly", data: finalResult };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

async function deleteData(id, schema) {
  try {
    const result = await schema.findByIdAndDelete(id);
    if (!result) {
      return { success: false, message: "Borrower not found" };
    }
    return { success: true, message: "Borrower deleted successfully" };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

async function findDataById(id, schema) {
  try {
    const result = await schema.findById(id);
    if (!result) {
      return { success: false, message: "Data not found" };
    }
    return { success: true, data: result };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

async function getAllData(schema) {
  try {
    const borrowers = await schema.find();
    return { success: true, data: borrowers };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

module.exports = {
  saveData,
  getAllPagination,
  findData,
  updateSettledData,
  deleteData,
  findDataById,
  getAllData,
};
