// routes/instrumentRentalRoutes.ts
import express from "express";
import {
  createRental,
  getAllRentals,
  getRentalById,
  updateRental,
  deleteRental,
} from "../controllers/instrumentRental.controller";

const router = express.Router();

router.post("/instrument", createRental);
router.get("/instrument", getAllRentals);
router.get("/instrument/:id", getRentalById);
router.put("/instrument/:id", updateRental);
router.delete("/instrument/:id", deleteRental);

export default router;
