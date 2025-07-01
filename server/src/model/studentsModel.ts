import mongoose from "mongoose";

const studentsSchema = new mongoose.Schema({
  studentName: {
    type: String,
    require: true,
  },
  studentsEmail: {
    type: String,
    require: true,
    unique: true,
  },
  studentsMobileNumber: {
    type: Number,
    require: true,
    unique: true,
  },
  studentsInstruments: {
    type: [String],
  },
  studentsJoiningDate: {
    type: Date,
    default: new Date(),
  },
  studentsBranch: {
    type: String,
  },
  studentsAge: {
    type: Number,
  },
  studentsProfile: {
    type: String,
    default: "",
  },
  StudentsStatus: {
    type: String,
    default: "Active",
  },
  studentsAddress: {
    country: {
      type: String,
      default: "India",
    },
    city: {
      type: String,
      default: "Pune",
    },
    address: {
      type: String,
    },
  },
});

export const students = mongoose.model("student", studentsSchema);
