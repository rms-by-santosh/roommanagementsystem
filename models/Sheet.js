import mongoose from "mongoose";

const sheetSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  isCurrent: { type: Boolean, default: false },
  entries: [{
    dop: { type: String, required: true },   // Date of Payment
    particulars: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: String, required: true },
  }],
}, { timestamps: true });

export const Sheet = mongoose.model("Sheet", sheetSchema);
