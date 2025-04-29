const mongoose = require("mongoose");

const borrower = new mongoose.Schema({
  accountNumber: { type: Number, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  oldAccountNumber: { type: Number },
  mobileNumber: { type: Number, required: true },
  loadAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  balanceAmount: { type: Number, required: true },
  amountPaid: { type: Number, required: true },
  intrest: { type: Number, required: true },
  profilePic: { type: String },
  pinCode: { type: Number, required: true },
  landMark: { type: String, required: true },
  gender: { type: Number, required: true },
  refName: { type: String },
  refAccNo: { type: Number },
  refMobileNo: { type: Number },
  inRupees: { type: String, required: true },
  userId: { type: Number, required: true },
  borrowerType: { type: String, required: true },
  modifiedAt: { type: String, required: true },
  createdAt: { type: String, required: true },
  amountSettled: [
    {
      date: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
});

borrower.index({ name: 1 });
borrower.index({ mobileNumber: 1 });
borrower.index({ oldAccountNumber: 1 });
borrower.index({ mobileNumber: 1, name: 1, oldAccountNumber: 1 });

const borrowerWeeklySchema = mongoose.model("Borrower", borrower);

module.exports = borrowerWeeklySchema;
