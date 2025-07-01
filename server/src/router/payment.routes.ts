import express from "express";
import {
  createPayment,
  getPaymentById,
  getAllPayments,
  updatePayment,
  deletePayment,
} from "../controllers/payment.controller";

const router = express.Router();

router.post("/payment", createPayment);

router.get("/payment", getAllPayments);

router.get("/payment/:id", getPaymentById);

router.put("/payment/:id", updatePayment);

router.delete("/payment/:id", deletePayment);

export default router;
