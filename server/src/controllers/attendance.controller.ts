import { Request, Response } from "express";
import { Attendance } from "../model/attendanceModel";
import asyncHandler from "../utils/asyncHandler";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse";

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
			return res
				.status(400)
				.json(
					new ApiResponse(
						400,
						null,
						"attendanceOfClass and attendanceRecord are required."
					)
				);
		}

		const newAttendance = await Attendance.create({
			attendanceDate: attendanceDate || new Date(),
			attendanceRemark,
			attendanceOfClass,
			attendanceRecord,
		});

		res
			.status(201)
			.json(
				new ApiResponse(201, newAttendance, "Attendance recorded successfully.")
			);
	}
);

// GET /attendance
export const getAllAttendance = asyncHandler(
	async (req: Request, res: Response) => {
		const attendanceRecords = await Attendance.find().populate(
			"attendanceRecord.attendanceStudentsId"
		);
		res
			.status(200)
			.json(new ApiResponse(201, attendanceRecords, "Attendance Filled "));
	}
);
export const getAttendanceByStudentId = asyncHandler(
	async (req: Request, res: Response) => {
		const { studentId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(studentId)) {
			return res
				.status(400)
				.json(new ApiResponse(400, null, "Invalid student ID format."));
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
				.json(
					new ApiResponse(
						404,
						null,
						"No attendance records found for the student."
					)
				);
		}
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					attendanceRecords,
					"Attendance records fetched successfully"
				)
			);
	}
);
