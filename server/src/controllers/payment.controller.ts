import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { Payment } from "../model/paymentModel";
import mongoose from "mongoose";

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Public / Admin
export const createPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  }
);

// @desc    Get a payment by ID
// @route   GET /api/payments/:id
// @access  Public / Admin
export const getPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const payment = await Payment.findById(req.params.id).populate("student");
    if (!payment) {
      res.status(404);
      throw new Error("Payment not found");
    }
    res.json(payment);
  }
);

// @desc    Get all payments (optionally filtered by student or month)
// @route   GET /api/payments
// @access  Public / Admin
export const getAllPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const { student, month } = req.query;
    const filter: any = {};
    if (student)
      filter.student = new mongoose.Types.ObjectId(student as string);
    if (month) filter.month = month;

    const payments = await Payment.find(filter).populate("student");
    res.json(payments);
  }
);

// @desc    Update a payment by ID
// @route   PUT /api/payments/:id
// @access  Public / Admin
export const updatePayment = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPayment) {
      res.status(404);
      throw new Error("Payment not found");
    }

    res.json(updatedPayment);
  }
);

// @desc    Delete a payment by ID
// @route   DELETE /api/payments/:id
// @access  Public / Admin
export const deletePayment = asyncHandler(
  async (req: Request, res: Response) => {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      res.status(404);
      throw new Error("Payment not found");
    }
    res.json({ message: "Payment deleted successfully" });
  }
);
