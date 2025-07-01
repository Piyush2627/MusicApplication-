import mongoose, { Schema, Document } from "mongoose";

export interface IInstrumentRental extends Document {
  instrumentName: string;
  instrumentType: string;
  rentedBy: string;
  rentedByType: "Student" | "Other";
  rentAmount: number;
  paymentStatus: "paid" | "pending";
  rentDate: Date;
  returnDate: Date;
}

const InstrumentRentalSchema = new Schema<IInstrumentRental>({
  instrumentName: { type: String, required: true },
  instrumentType: { type: String, required: true },
  rentedBy: {
    type: String,
    required: true,
  },
  rentedByType: { type: String, enum: ["Student", "Other"], required: true },
  rentAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["paid", "pending"],
    default: "pending",
  },
  rentDate: { type: Date, default: Date.now },
  returnDate: { type: Date, required: true },
});

export default mongoose.model<IInstrumentRental>(
  "InstrumentRental",
  InstrumentRentalSchema
);
