import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", protect, adminOnly, registerUser);
router.post("/login", loginUser);
router.get("/", protect, adminOnly, getUsers);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
