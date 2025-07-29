import express from "express";
import {
  createSheet,
  getSheets,
  deleteSheet,
  setCurrentSheet,
  getCurrentSheet,
} from "../controllers/sheetController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, adminOnly, createSheet);
router.get("/", protect, getSheets);
router.delete("/:id", protect, adminOnly, deleteSheet);
router.put("/current/:id", protect, adminOnly, setCurrentSheet);
router.get("/current", protect, getCurrentSheet);

export default router;
