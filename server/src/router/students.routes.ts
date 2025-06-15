import { Router } from "express";
import {
  createStudents,
  getAllStudentsData,
  updateStudents,
  getStudentByID,
} from "../controllers/students.controller";

const router = Router();

router.post("/createStudent", createStudents);
router.get("/getStudent/:id", getStudentByID);
router.get("/getAllStudent", getAllStudentsData);
router.put("/updateStudent/:studentId", updateStudents);

export default router;
