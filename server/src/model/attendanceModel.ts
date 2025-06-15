import mongoose, { Schema, Document } from "mongoose";

export interface IAttendanceStudent {
  attendanceStudentsId: mongoose.Types.ObjectId;
  attendanceStatus: "Present" | "Absent" | "Late";
}

export interface IAttendance extends Document {
  attendanceDate: Date;
  attendanceRemark?: string;
  attendanceOfClass: mongoose.Types.ObjectId; // now references classBatch
  attendanceRecord: IAttendanceStudent[];
}

const attendanceSchema = new Schema<IAttendance>({
  attendanceDate: {
    type: Date,
    default: () => new Date(),
  },
  attendanceRemark: {
    type: String,
  },
  attendanceOfClass: {
    type: Schema.Types.ObjectId,
    ref: "classBatch",
    required: true,
  },
  attendanceRecord: [
    {
      attendanceStudentsId: {
        type: Schema.Types.ObjectId,
        ref: "student",
        required: true,
      },
      attendanceStatus: {
        type: String,
        enum: ["Present", "Absent", "Late"],
        default: "Absent",
      },
    },
  ],
});

export const Attendance = mongoose.model<IAttendance>(
  "attendance",
  attendanceSchema
);
