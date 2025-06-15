import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { Teacher, ITeacher } from "../model/teacherModel"; // adjust path as needed

// @desc    Create a new teacher
// @route   POST /api/teachers
// @access  Public (or Protected once you add auth)
export const createTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      teacherName,
      teacherEmail,
      teacherMobileNumber,
      teacherInstruments,
      teacherJoiningDate,
      teacherBranch,
      teacherProfile,
    } = req.body;

    // Basic validation
    if (
      !teacherName ||
      !teacherEmail ||
      !teacherMobileNumber ||
      !teacherInstruments
    ) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    // Check for existing email or mobile
    const emailExists = await Teacher.findOne({ teacherEmail });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const mobileExists = await Teacher.findOne({ teacherMobileNumber });
    if (mobileExists) {
      return res.status(400).json({ message: "Mobile number already in use." });
    }

    const newTeacher = await Teacher.create({
      teacherName,
      teacherEmail,
      teacherMobileNumber,
      teacherInstruments,
      teacherJoiningDate,
      teacherBranch,
      teacherProfile,
    } as Partial<ITeacher>);

    res.status(201).json(newTeacher);
  }
);

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Public (or Protected)
export const getAllTeachers = asyncHandler(
  async (req: Request, res: Response) => {
    const teachers = await Teacher.find();
    res.json(teachers);
  }
);

// @desc    Get a single teacher by ID
// @route   GET /api/teachers/:id
// @access  Public (or Protected)
export const getTeacherById = asyncHandler(
  async (req: Request, res: Response) => {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    res.json(teacher);
  }
);

// @desc    Update a teacher
// @route   PUT /api/teachers/:id
// @access  Public (or Protected)
export const updateTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    // Prevent updating to an email/mobile that already exists on another document
    if (
      req.body.teacherEmail &&
      req.body.teacherEmail !== teacher.teacherEmail
    ) {
      const emailExists = await Teacher.findOne({
        teacherEmail: req.body.teacherEmail,
      });
      if (emailExists) {
        return res
          .status(400)
          .json({ message: "Email already in use by another teacher." });
      }
    }

    if (
      req.body.teacherMobileNumber &&
      req.body.teacherMobileNumber !== teacher.teacherMobileNumber
    ) {
      const mobileExists = await Teacher.findOne({
        teacherMobileNumber: req.body.teacherMobileNumber,
      });
      if (mobileExists) {
        return res.status(400).json({
          message: "Mobile number already in use by another teacher.",
        });
      }
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedTeacher);
  }
);

// @desc    Delete a teacher
// @route   DELETE /api/teachers/:id
// @access  Public (or Protected)
export const deleteTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    await teacher.deleteOne();
    res.json({ message: "Teacher deleted successfully." });
  }
);
