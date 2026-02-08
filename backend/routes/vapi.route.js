import express from "express";
import { 
  generatePost, 
  generateGet,
  getUserInterviews,
  getInterview,
  deleteInterview 
} from "../controllers/vapi.controller.js";

const router = express.Router();

// Generate interview questions
router.post("/generate", generatePost);
router.get("/generate", generateGet);

// Interview CRUD operations
router.get("/interviews", getUserInterviews);
router.get("/interviews/:id", getInterview);
router.delete("/interviews/:id", deleteInterview);

export default router;
