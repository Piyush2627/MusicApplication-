import express from "express";
import {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
} from "../controllers/classBatch.controller";

const router = express.Router();

router.route("/batches").post(createBatch).get(getAllBatches);
router
  .route("/batches/:id")
  .get(getBatchById)
  .put(updateBatch)
  .delete(deleteBatch);

export default router;
