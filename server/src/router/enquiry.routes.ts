import express from "express";
import {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiry,
  addRemarkToEnquiry,
} from "../controllers/enquiry.controller";

const router = express.Router();

router.post("/enquiries", createEnquiry);
router.get("/enquiries", getAllEnquiries);
router.get("/enquiries/enquiry/:id", getEnquiryById);
router.put("/enquiries/:id", updateEnquiry);
router.post("/enquiries/:enquiryId/remarks", addRemarkToEnquiry);

export default router;
