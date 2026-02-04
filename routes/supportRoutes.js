import express from "express";
import {
  createSupportMessage,
  getAllSupportMessages,
} from "../controllers/supportController.js";

const router = express.Router();

// =======================
// Support Routes (Public)
// =======================

// Create support message
router.post("/support-message", createSupportMessage);

// Get all support messages
router.get("/all-support-message", getAllSupportMessages);

export default router;
