// controllers/transactionController.js
const transactionModel = require("../models/transactionModel");
const moment = require("moment");

/**
 * ✅ Get All Transactions
 */
const getAllTransaction = async (req, res) => {
  try {
    const { frequency, selectedDate, type, userid } = req.body;

    if (!userid) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const query = { userid };

    // 🔹 Frequency filter (last X days)
    if (frequency && frequency !== "custom") {
      query.date = {
        $gte: moment().subtract(Number(frequency), "d").startOf("day").toDate(),
      };
    }

    // 🔹 Custom date range filter
    if (frequency === "custom" && Array.isArray(selectedDate) && selectedDate.length === 2) {
      query.date = {
        $gte: new Date(selectedDate[0]),
        $lte: new Date(selectedDate[1]),
      };
    }

    // 🔹 Type filter
    if (type && type !== "all") {
      query.type = type.toLowerCase();
    }

    const transactions = await transactionModel.find(query).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * ✅ Add Transaction
 */
const addTransaction = async (req, res) => {
  try {
    const { date, ...rest } = req.body;

    if (!date) {
      return res.status(400).json({ error: "Date is required." });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format provided." });
    }

    const newTransaction = new transactionModel({
      ...rest,
      date: parsedDate,
    });

    await newTransaction.save();

    res.status(201).json({ message: "Transaction created successfully." });
  } catch (error) {
    console.error("❌ Error adding transaction:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * ✅ Edit Transaction
 */
const editTransaction = async (req, res) => {
  try {
    const { transactionId, payload } = req.body;

    if (!transactionId) {
      return res.status(400).json({ error: "Transaction ID is required." });
    }

    const updatePayload = { ...payload };

    // 🔹 Validate date if provided
    if (updatePayload.date) {
      const parsedDate = new Date(updatePayload.date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format provided." });
      }
      updatePayload.date = parsedDate;
    }

    // 🔹 Allow null date if explicitly set
    if (Object.prototype.hasOwnProperty.call(payload, "date") && payload.date === null) {
      updatePayload.date = null;
    }

    const updatedTransaction = await transactionModel.findOneAndUpdate(
      { _id: transactionId },
      updatePayload,
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    res.status(200).json({ message: "Transaction updated successfully." });
  } catch (error) {
    console.error("❌ Error editing transaction:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * ✅ Delete Transaction
 */
const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ error: "Transaction ID is required." });
    }

    const deletedTransaction = await transactionModel.findOneAndDelete({ _id: transactionId });

    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    res.status(200).json({ message: "Transaction deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting transaction:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllTransaction,
  addTransaction,
  editTransaction,
  deleteTransaction,
};
