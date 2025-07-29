import express from "express";
import {
  createRequest,
  getRequests,
  approveRequest,
  rejectRequest,
} from "../controllers/requestController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createRequest);
router.get("/", protect, getRequests);
router.put("/approve/:id", protect, adminOnly, approveRequest);
router.put("/reject/:id", protect, adminOnly, rejectRequest);

export default router;
