const mongoose = require("mongoose");
const Borrower = require("./models/borrowerWeeklySchema");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/lender", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB database");

    // Ensure indexes are applied
    await Borrower.syncIndexes();
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    throw err;
  }
}

module.exports = connectDB;
