import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ClassBatch } from "../model/classBatchModel";

export const createBatch = asyncHandler(async (req: Request, res: Response) => {
  const {
    batchName,
    batchInstructor,
    batchInstrument,
    batchTiming,
    batchStudents,
    batchStartDate,
    batchBranch,
  } = req.body;

  if (!batchName || !batchInstructor || !batchTiming) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  const batch = await ClassBatch.create({
    batchName,
    batchInstructor,
    batchInstrument,
    batchTiming,
    batchStudents,
    batchStartDate,
    batchBranch,
  });

  res.status(201).json(batch);
});

export const getAllBatches = asyncHandler(
  async (req: Request, res: Response) => {
    const batches = await ClassBatch.find()
      .populate("batchInstructor", "teacherName teacherEmail")
      .populate("batchStudents");
    res.json(batches);
  }
);

export const getBatchById = asyncHandler(
  async (req: Request, res: Response) => {
    const batch = await ClassBatch.findById(req.params.id)
      .populate("batchInstructor", "teacherName")
      .populate("batchStudents", "studentName");

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.json(batch);
  }
);

export const updateBatch = asyncHandler(async (req: Request, res: Response) => {
  const batch = await ClassBatch.findById(req.params.id);

  if (!batch) {
    return res.status(404).json({ message: "Batch not found" });
  }

  const updatedBatch = await ClassBatch.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.json(updatedBatch);
});

export const deleteBatch = asyncHandler(async (req: Request, res: Response) => {
  const batch = await ClassBatch.findById(req.params.id);

  if (!batch) {
    return res.status(404).json({ message: "Batch not found" });
  }

  await batch.deleteOne();
  res.json({ message: "Batch deleted successfully" });
});
