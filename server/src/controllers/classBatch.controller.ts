import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ClassBatch } from "../model/classBatchModel"; // adjust path as needed

// @desc    Create a new class batch
// @route   POST /api/batches
// @access  Public or Protected (add auth later if needed)
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

// @desc    Get all class batches
// @route   GET /api/batches
// @access  Public or Protected
export const getAllBatches = asyncHandler(
  async (req: Request, res: Response) => {
    const batches = await ClassBatch.find()
      .populate("batchInstructor", "teacherName teacherEmail")
      .populate("batchStudents");
    res.json(batches);
  }
);

// @desc    Get a single batch by ID
// @route   GET /api/batches/:id
// @access  Public or Protected
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

// @desc    Update a batch
// @route   PUT /api/batches/:id
// @access  Public or Protected
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

// @desc    Delete a batch
// @route   DELETE /api/batches/:id
// @access  Public or Protected
export const deleteBatch = asyncHandler(async (req: Request, res: Response) => {
  const batch = await ClassBatch.findById(req.params.id);

  if (!batch) {
    return res.status(404).json({ message: "Batch not found" });
  }

  await batch.deleteOne();
  res.json({ message: "Batch deleted successfully" });
});
