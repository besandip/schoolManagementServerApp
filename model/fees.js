const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  class: { type: String, enum: ["1", "2", "3", "4", "5"], required: true },
  monthlyFees: { type: Number}, // Required since monthly fees are constant
  annualFees: { type: Number}, // Annual fee as a fixed value
  annualRecord: {
    totalPaid: { type: Number, default: 0,}, // Total annual fees paid
    due: { type: Number, default: 0,}, // Remaining annual fees
    lastPaymentDate: { type: Date }, // Date of the last annual payment
  },
  monthlyRecord: [
    {
      month: { type: String, required: true }, // e.g., "January", "February"
      amountPaid: { type: Number, default: 0}, // Amount paid for the month
      due: { type: Number, default: 0}, // Remaining amount for the month
      paymentDate: { type: Date }, // Date of payment
    }
  ],
  paymentHistory: [
    {
      paymentType: { type: String, enum: ["Annual", "Monthly"]},
      amount: { type: Number},
      date: { type: Date },
      month: { type: String }, // Optional, only used for monthly payments
      due:{ type: Number}
    }
  ]
});

const Fees = mongoose.model("Fees", feesSchema);
module.exports = Fees;
