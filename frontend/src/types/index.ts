export interface Interview {
  id: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  level: string;
  questions: string[];
  finalized: boolean;
  createdAt: string;
  coverImage?: string;
}

export interface FeedbackCategory {
  name: string;
  score: number;
  comment: string;
}

export interface InterviewFeedback {
  totalScore: number;
  categoryScores: FeedbackCategory[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
}
