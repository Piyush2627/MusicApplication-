import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ClassBatch } from "../model/classBatchModel";
import { ApiResponse } from "../utils/ApiResponse";

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
		return res
			.status(400)
			.json(new ApiResponse(400, null, "Required fields are missing."));
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

	res
		.status(201)
		.json(new ApiResponse(201, batch, "Batch created successfully"));
});

export const getAllBatches = asyncHandler(
	async (req: Request, res: Response) => {
		const batches = await ClassBatch.find()
			.populate("batchInstructor", "userName")
			.populate("batchStudents");
		res
			.status(200)
			.json(new ApiResponse(200, batches, "Batches fetched successfully"));
	}
);

export const getBatchById = asyncHandler(
	async (req: Request, res: Response) => {
		const batch = await ClassBatch.findById(req.params.id)
			.populate("batchInstructor", "teacherName")
			.populate("batchStudents", "studentName");

		if (!batch) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Batch not found"));
		}

		res
			.status(200)
			.json(new ApiResponse(200, batch, "Batch fetched successfully"));
	}
);

export const updateBatch = asyncHandler(async (req: Request, res: Response) => {
	const batch = await ClassBatch.findById(req.params.id);

	if (!batch) {
		return res.status(404).json(new ApiResponse(404, null, "Batch not found"));
	}

	const updatedBatch = await ClassBatch.findByIdAndUpdate(
		req.params.id,
		{ $set: req.body },
		{ new: true, runValidators: true }
	);

	res
		.status(200)
		.json(new ApiResponse(200, updatedBatch, "Batch updated successfully"));
});

export const deleteBatch = asyncHandler(async (req: Request, res: Response) => {
	const batch = await ClassBatch.findById(req.params.id);

	if (!batch) {
		return res.status(404).json(new ApiResponse(404, null, "Batch not found"));
	}

	await batch.deleteOne();
	res
		.status(200)
		.json(new ApiResponse(200, null, "Batch deleted successfully"));
});
