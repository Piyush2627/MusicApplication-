import mongoose, { Schema, Document } from "mongoose";

export interface IClassBatch extends Document {
  batchName: string;
  batchInstructor: mongoose.Types.ObjectId; // Could reference a "teacher" model
  batchInstrument?: string; // Optional: e.g., "Guitar", "Piano"
  batchTiming: string; // e.g., "Mon-Wed 5PM-6PM"
  batchStudents: mongoose.Types.ObjectId[];
  batchStartDate?: Date;
  batchBranch?: string;
}

const classBatchSchema = new Schema<IClassBatch>(
  {
    batchName: {
      type: String,
      required: true,
    },
    batchInstructor: {
      type: Schema.Types.ObjectId,
      ref: "user", // Adjust according to your instructor/teacher model
    },
    batchInstrument: {
      type: String,
    },
    batchTiming: {
      type: String,
      required: true,
    },
    batchStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "student",
      },
    ],
    batchStartDate: {
      type: Date,
      default: () => new Date(),
    },
    batchBranch: {
      type: String,
    },
  },
  { timestamps: true }
);

export const ClassBatch = mongoose.model<IClassBatch>(
  "classBatch",
  classBatchSchema
);
