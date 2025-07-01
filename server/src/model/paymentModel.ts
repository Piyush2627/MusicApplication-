import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  student: mongoose.Types.ObjectId; // references "student"
  month: string; // Format: YYYY-MM (e.g., "2025-06")
  paymentDueDate: Date; // Always 1st of the month
  classesAttended: number; // Count of present/late days
  amount: number; // Fee calculated based on attendance
  status: "paid" | "unpaid";
  paymentDate?: Date; // Actual payment date if paid
}

const paymentSchema = new Schema<IPayment>({
  student: {
    type: Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  classesAttended: {
    type: Number,
    default: 8,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["paid", "unpaid"],
    default: "unpaid",
  },
  paymentDate: {
    type: Date,
  },
});

paymentSchema.index({ student: 1, month: 1 }, { unique: true }); // Prevent duplicate monthly payments

export const Payment = mongoose.model<IPayment>("payment", paymentSchema);
