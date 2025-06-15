import mongoose, { Schema, Document } from "mongoose";

export interface ITeacher extends Document {
  teacherName: string;
  teacherEmail: string;
  teacherMobileNumber: number;
  teacherInstruments: string[];
  teacherJoiningDate?: Date;
  teacherBranch?: string;
  teacherProfile?: string;
}

const teacherSchema = new Schema<ITeacher>(
  {
    teacherName: {
      type: String,
      required: true,
    },
    teacherEmail: {
      type: String,
      required: true,
      unique: true,
    },
    teacherMobileNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    teacherInstruments: {
      type: [String],
      required: true,
    },
    teacherJoiningDate: {
      type: Date,
      default: () => new Date(),
    },
    teacherBranch: {
      type: String,
    },
    teacherProfile: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Teacher = mongoose.model<ITeacher>("teacher", teacherSchema);
