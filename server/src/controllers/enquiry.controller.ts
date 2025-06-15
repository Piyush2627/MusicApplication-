import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import Enquiry from "../model/enquiry.model";
import { EnquiryInput } from "../types/enquiry.types";

export const createEnquiry = asyncHandler(
  async (req: Request, res: Response) => {
    const enquiryData: EnquiryInput = req.body;
    const newEnquiry = await Enquiry.create(enquiryData);
    res.status(201).json(newEnquiry);
  }
);

export const getAllEnquiries = asyncHandler(
  async (_req: Request, res: Response) => {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  }
);

export const getEnquiryById = asyncHandler(
  async (req: Request, res: Response) => {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      res.status(404);
      throw new Error("Enquiry not found");
    }
    res.json(enquiry);
  }
);

export const updateEnquiry = asyncHandler(
  async (req: Request, res: Response) => {
    const updated = await Enquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      res.status(404);
      throw new Error("Enquiry not found");
    }
    res.json(updated);
  }
);

export const addRemarkToEnquiry = asyncHandler(
  async (req: Request, res: Response) => {
    const { enquiryId } = req.params;
    const { note, addedBy } = req.body;

    if (!note || !addedBy) {
      return res
        .status(400)
        .json({ error: "Both 'note' and 'addedBy' are required." });
    }

    const enquiry = await Enquiry.findById(enquiryId);

    if (!enquiry) {
      return res.status(404).json({ error: "Enquiry not found." });
    }

    enquiry.remarks.push({
      note,
      addedBy,
      createdAt: new Date(),
    });

    await enquiry.save();

    return res.status(200).json({
      message: "Remark added successfully.",
      enquiry,
    });
  }
);
