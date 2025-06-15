import express from "express";
import { Response, Request } from "express";
import {
  createAttendance,
  getAllAttendance,
  getAttendanceByStudentId,
} from "../controllers/attendance.controller";
import asyncHandler from "../utils/asyncHandler";
import { students } from "../model/studentsModel";
const router = express.Router();

router.post("/attendance", createAttendance);

router.get("/attendance", getAllAttendance);

router.get("/attendance/student/:studentId", getAttendanceByStudentId);

export default router;
