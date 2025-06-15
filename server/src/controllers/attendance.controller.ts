import { Request, Response } from "express";
import { Attendance } from "../model/attendanceModel";
import asyncHandler from "../utils/asyncHandler";
import mongoose from "mongoose";

// POST /attendance
export const createAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      attendanceDate,
      attendanceRemark,
      attendanceOfClass,
      attendanceRecord,
    } = req.body;

    if (!attendanceOfClass || !Array.isArray(attendanceRecord)) {
      return res.status(400).json({
        message: "attendanceOfClass and attendanceRecord are required.",
      });
    }

    const newAttendance = await Attendance.create({
      attendanceDate: attendanceDate || new Date(),
      attendanceRemark,
      attendanceOfClass,
      attendanceRecord,
    });

    res.status(201).json({
      message: "Attendance recorded successfully.",
      data: newAttendance,
    });

    res
      .status(500)
      .json({ message: "Server error while recording attendance." });
  }
);

// GET /attendance
export const getAllAttendance = async (req: Request, res: Response) => {
  try {
    const attendanceRecords = await Attendance.find().populate(
      "attendanceRecord.attendanceStudentsId"
    );
    res.status(200).json({ data: attendanceRecords });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching attendance." });
  }
};

export const getAttendanceByStudentId = asyncHandler(
  async (req: Request, res: Response) => {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID format." });
    }

    const attendanceRecords = await Attendance.find(
      {
        "attendanceRecord.attendanceStudentsId": studentId,
      },
      {
        attendanceDate: 1,
        attendanceRemark: 1,
        attendanceOfClass: 1,
        attendanceRecord: {
          $elemMatch: { attendanceStudentsId: studentId },
        },
      }
    ).populate("attendanceRecord.attendanceStudentsId", "name email"); // optionally populate student info

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for the student." });
    }
    return res.status(200).json(attendanceRecords);
  }
);
