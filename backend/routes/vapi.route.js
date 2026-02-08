import express from "express";
import { generatePost, generateGet } from "../controllers/vapi.controller.js";

const router = express.Router();

router.post("/generate", generatePost);
router.get("/generate", generateGet);

export default router;
