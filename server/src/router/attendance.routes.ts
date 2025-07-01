import express from "express";

import {
  createAttendance,
  getAllAttendance,
  getAttendanceByStudentId,
} from "../controllers/attendance.controller";

const router = express.Router();

router.post("/attendance", createAttendance);

router.get("/attendance", getAllAttendance);

router.get("/attendance/student/:studentId", getAttendanceByStudentId);

export default router;
