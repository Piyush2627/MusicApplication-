import express from "express";
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller"; // adjust path as needed

const router = express.Router();

router.route("/teacher").post(createTeacher).get(getAllTeachers);
router
  .route("/teacher/:id")
  .get(getTeacherById)
  .put(updateTeacher)
  .delete(deleteTeacher);

export default router;
