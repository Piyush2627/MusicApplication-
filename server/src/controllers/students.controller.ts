import { Response, Request } from "express";
import asyncHandler from "../utils/asyncHandler";
import { students } from "../model/studentsModel";

const createStudents = asyncHandler(async (req: Request, res: Response) => {
  const {
    studentName,
    studentsEmail,
    studentsMobileNumber,
    studentsAge,
    studentsBranch,
    studentsInstruments,
    studentsJoiningDate,
    studentsAddress,
  } = req.body;

  const newStudents = await students.create({
    studentName,
    studentsEmail,
    studentsMobileNumber,
    studentsAge,
    studentsBranch,
    studentsInstruments,
    studentsJoiningDate,
    studentsAddress,
  });
  res.status(200).json(newStudents);
});

const updateStudents = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const updateData = req.body;

  try {
    const updatedDoc = await students.findByIdAndUpdate(studentId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json(updatedDoc);
  } catch (error) {
    res.status(500).json({ message: "Error updating document", error });
  }
});

const getStudentByID = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const instance = await students.findById(id);
  res.status(200).json(instance);
});

const getAllStudentsData = asyncHandler(async (req: Request, res: Response) => {
  const instance = await students.find();
  res.status(200).json(instance);
});

export { createStudents, getAllStudentsData, updateStudents, getStudentByID };
