import { Schema, model, Document } from "mongoose";

export interface Remark {
  note: string;
  addedBy: string;
  createdAt: Date;
}

export interface EnquiryDocument extends Document {
  studentName: string;
  email: string;
  phone: string;
  instrument: string;
  preferredTime: string;
  message?: string;
  status: "pending" | "contacted" | "enrolled";
  remarks: Remark[];
  createdAt: Date;
}

const remarkSchema = new Schema<Remark>(
  {
    note: { type: String, required: true },
    addedBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const enquirySchema = new Schema<EnquiryDocument>(
  {
    studentName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    instrument: { type: String, required: true },
    preferredTime: { type: String, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "contacted", "enrolled"],
      default: "pending",
    },
    remarks: [remarkSchema],
  },
  { timestamps: true }
);

export default model<EnquiryDocument>("Enquiry", enquirySchema);
