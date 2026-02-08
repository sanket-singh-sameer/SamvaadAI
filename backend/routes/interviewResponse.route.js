import express from "express";
import {
  saveInterviewResponse,
  getInterviewResponse,
  getUserInterviewResponses,
  getInterviewResponsesByInterview,
  deleteInterviewResponse,
} from "../controllers/interviewResponse.controller.js";

const router = express.Router();

// Save interview response
router.post("/", saveInterviewResponse);

// Get interview response by ID
router.get("/:id", getInterviewResponse);

// Get all responses for a user
router.get("/user/:userId", getUserInterviewResponses);

// Get all responses for an interview
router.get("/interview/:interviewId", getInterviewResponsesByInterview);

// Delete interview response
router.delete("/:id", deleteInterviewResponse);

export default router;
