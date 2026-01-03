import { Router } from "express";
import attendanceRoutes from "./attendance.routes";
import userRoutes from "./user.routes";
import classBatchRoutes from "./class-batch.routes";
import enquiryRoutes from "./enquiry.routes";
import instrumentRentalRoutes from "./instrumentRental.routes";
import studentsRoutes from "./students.routes";
import paymentRoutes from "./payment.routes";

const router = Router();
router.use("/api", userRoutes);
router.use("/api", studentsRoutes);
router.use("/api", attendanceRoutes);
router.use("/api", classBatchRoutes);
router.use("/api", enquiryRoutes);
router.use("/api", instrumentRentalRoutes);
router.use("/api", paymentRoutes);

export default router;
