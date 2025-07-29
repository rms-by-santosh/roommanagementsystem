import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  dop: { type: String, required: true },      // Date of Payment
  particulars: { type: String, required: true },
  amount: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

export const Request = mongoose.model("Request", requestSchema);
