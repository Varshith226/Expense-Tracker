// server/models/Bill.js
const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    userid: { type: String, required: true },
    title: { type: String, required: true },      // e.g. "Electricity Bill"
    amount: { type: Number, required: true },
    category: { type: String, default: "bills" },
    dueDate: { type: Date, required: true },
    autopay: { type: Boolean, default: false },
    paid: { type: Boolean, default: false },
    snoozedUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
