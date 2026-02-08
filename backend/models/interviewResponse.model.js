import mongoose from "mongoose";

const interviewResponseSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    qaTranscript: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    fullTranscript: {
      type: [String],
      default: [],
    },
    vapiCallId: {
      type: String,
    },
    evaluation: {
      totalScore: {
        type: Number,
        required: true,
      },
      categoryScores: [
        {
          name: {
            type: String,
            required: true,
          },
          score: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
      strengths: {
        type: [String],
        default: [],
      },
      areasForImprovement: {
        type: [String],
        default: [],
      },
      finalAssessment: {
        type: String,
        required: true,
      },
    },
    duration: {
      type: Number, // in seconds
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const InterviewResponse = mongoose.model("InterviewResponse", interviewResponseSchema);

export default InterviewResponse;
