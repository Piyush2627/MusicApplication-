import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import InstrumentRental from "../model/InstrumentRentalModel";

// @desc    Create a new rental
// @route   POST /api/rentals
export const createRental = asyncHandler(
  async (req: Request, res: Response) => {
    const rental = new InstrumentRental(req.body);
    const savedRental = await rental.save();
    res.status(201).json(savedRental);
  }
);

// @desc    Get all rentals
// @route   GET /api/rentals
export const getAllRentals = asyncHandler(
  async (_req: Request, res: Response) => {
    const rentals = await InstrumentRental.find();
    res.status(200).json(rentals);
  }
);

// @desc    Get single rental
// @route   GET /api/rentals/:id
export const getRentalById = asyncHandler(
  async (req: Request, res: Response) => {
    const rental = await InstrumentRental.findById(req.params.id);
    if (!rental) {
      res.status(404);
      throw new Error("Rental not found");
    }
    res.status(200).json(rental);
  }
);

// @desc    Update rental
// @route   PUT /api/rentals/:id
export const updateRental = asyncHandler(
  async (req: Request, res: Response) => {
    console.log(req.params.id);
    const updatedRental = await InstrumentRental.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRental) {
      res.status(404);
      throw new Error("Rental not found");
    }
    res.status(200).json(updatedRental);
  }
);

// @desc    Delete rental
// @route   DELETE /api/rentals/:id
export const deleteRental = asyncHandler(
  async (req: Request, res: Response) => {
    const rental = await InstrumentRental.findByIdAndDelete(req.params.id);
    if (!rental) {
      res.status(404);
      throw new Error("Rental not found");
    }
    res.status(200).json({ message: "Rental deleted successfully" });
  }
);
