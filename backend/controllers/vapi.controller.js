import { GoogleGenerativeAI } from "@google/generative-ai";
import Interview from "../models/interview.model.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getRandomInterviewCover = () => {
  const covers = [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902",
    "https://images.unsplash.com/photo-1551434678-e076c223a692",
  ];
  return covers[Math.floor(Math.random() * covers.length)];
};

export const generatePost = async (req, res) => {
  const { type, role, level, techstack, amount, userid } = req.body;

  try {
    // Validate required fields
    if (!type || !role || !level || !techstack || !amount || !userid) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: type, role, level, techstack, amount, userid",
      });
    }

    // Generate questions using Google Generative AI
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the questions from the response
    let questions;
    try {
      questions = JSON.parse(text);
    } catch (parseError) {
      // If parsing fails, try to extract JSON array from text
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse questions from AI response");
      }
    }

    // Create interview document
    const interview = new Interview({
      role,
      type,
      level,
      techstack: techstack.split(",").map(tech => tech.trim()),
      questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
    });

    await interview.save();

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error("Error generating interview:", error);
    res.status(500).json({
      success: false,
      message: "Error generating interview",
      error: error.message,
    });
  }
};

export const generateGet = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: "Thank you!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in generate GET",
      error: error.message,
    });
  }
};

// Get all interviews for a user
export const getUserInterviews = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const interviews = await Interview.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching interviews",
      error: error.message,
    });
  }
};

// Get a specific interview by ID
export const getInterview = async (req, res) => {
  const { id } = req.params;

  try {
    const interview = await Interview.findById(id).lean();

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error("Error fetching interview:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching interview",
      error: error.message,
    });
  }
};

// Delete an interview
export const deleteInterview = async (req, res) => {
  const { id } = req.params;

  try {
    const interview = await Interview.findByIdAndDelete(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
      data: interview,
    });
  } catch (error) {
    console.error("Error deleting interview:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting interview",
      error: error.message,
    });
  }
};
