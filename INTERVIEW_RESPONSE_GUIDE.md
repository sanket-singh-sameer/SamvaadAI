# Interview Response Management

## Overview

This system now saves complete interview sessions to MongoDB, including questions, answers (transcripts), evaluations, and performance scores.

## Backend Models

### InterviewResponse Model
Stores complete interview session data:
- `interviewId` - Reference to Interview collection
- `userId` - Reference to User collection
- `qaTranscript` - Array of Q&A pairs with timestamps
- `fullTranscript` - Complete conversation transcript
- `vapiCallId` - Vapi call ID for reference
- `evaluation` - Complete performance evaluation
  - `totalScore` - Overall score (0-100)
  - `categoryScores` - Individual category scores
  - `strengths` - List of strengths
  - `areasForImprovement` - Areas to improve
  - `finalAssessment` - Overall feedback
- `duration` - Interview duration in seconds
- `completedAt` - Completion timestamp

## API Endpoints

### Save Interview Response
```http
POST /api/interview-responses
Content-Type: application/json

{
  "interviewId": "65f8a2b3c4d5e6f7g8h9i0j1",
  "userId": "user123",
  "fullTranscript": ["Hello, thank you...", "I'm excited..."],
  "vapiCallId": "call_123",
  "evaluation": {
    "totalScore": 85,
    "categoryScores": [...],
    "strengths": [...],
    "areasForImprovement": [...],
    "finalAssessment": "Strong candidate..."
  },
  "duration": 420
}
```

### Get Interview Response
```http
GET /api/interview-responses/:id
```

### Get User's Interview Responses
```http
GET /api/interview-responses/user/:userId
```

### Get Responses for Specific Interview
```http
GET /api/interview-responses/interview/:interviewId
```

### Delete Interview Response
```http
DELETE /api/interview-responses/:id
```

## Frontend Integration

### Automatic Save on Interview Completion

When a Vapi interview ends, the system automatically:

1. Calculates interview duration
2. Generates evaluation scores
3. Saves all data to MongoDB
4. Redirects to `/results/:responseId`

### View Results

**With Response ID (from database):**
```
http://localhost:5173/results/:responseId
```

**With State (fallback):**
```javascript
navigate("/results", {
  state: {
    interview,
    evaluation,
    transcript
  }
});
```

## Data Flow

1. **Interview Creation** (`/vapi-interview/:interviewId`)
   - Fetches interview questions from database
   - Auto-starts Vapi interview

2. **Interview Session**
   - Tracks call start time
   - Collects transcript messages
   - Records Vapi responses

3. **Interview Completion**
   - Calculates duration
   - Generates evaluation
   - Saves InterviewResponse to MongoDB
   - Returns response ID

4. **Results Display** (`/results/:responseId`)
   - Fetches complete interview response
   - Shows scores and feedback
   - Displays category breakdown
   - Shows strengths and improvements

## Evaluation Categories

The system evaluates candidates across 5 categories:

1. **Communication Skills**
2. **Technical Knowledge**
3. **Problem Solving**
4. **Cultural Fit**
5. **Confidence and Clarity**

Each category receives:
- Score (0-100)
- Detailed comment

## Usage Example

```typescript
// In VapiInterview component
const {
  isCallActive,
  startCall,
  stopCall,
  transcript
} = useVapi({
  interview,
  onCallEnd: async () => {
    // Auto-saves to database
    const result = await saveInterviewResponse({
      interviewId: interview.id,
      userId: interview.userId,
      fullTranscript: transcript,
      evaluation: generatedEvaluation,
      duration: calculateDuration()
    });
    
    // Navigate to results with saved response ID
    navigate(`/results/${result.data._id}`);
  }
});
```

## Database Schema

```javascript
InterviewResponse {
  _id: ObjectId,
  interviewId: ObjectId -> Interview,
  userId: ObjectId -> User,
  qaTranscript: [
    {
      question: String,
      answer: String,
      timestamp: Date
    }
  ],
  fullTranscript: [String],
  vapiCallId: String,
  evaluation: {
    totalScore: Number,
    categoryScores: [
      {
        name: String,
        score: Number,
        comment: String
      }
    ],
    strengths: [String],
    areasForImprovement: [String],
    finalAssessment: String
  },
  duration: Number,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

### 1. Create an Interview
```bash
curl -X POST http://localhost:8080/api/vapi/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Technical",
    "role": "Full Stack Developer",
    "level": "Senior",
    "techstack": "react,nodejs,mongodb",
    "amount": 5,
    "userid": "test_user_123"
  }'
```

### 2. Start Interview
```
http://localhost:5173/vapi-interview/:interviewId
```

### 3. Complete Interview
- Interview auto-starts
- Answer questions via Vapi
- End interview (auto-saves)

### 4. View Results
```
http://localhost:5173/results/:responseId
```

## Features

✅ Complete interview session tracking  
✅ Automatic evaluation generation  
✅ Performance breakdown by category  
✅ Transcript storage  
✅ Duration tracking  
✅ Direct results access via ID  
✅ Fallback to state data  
✅ MongoDB persistence  
✅ RESTful API  

## Next Steps

1. **Enhance Evaluation** - Extract actual evaluation from Vapi AI responses
2. **Q&A Parsing** - Parse questions and answers from transcript
3. **Analytics** - Add interview analytics dashboard
4. **PDF Export** - Generate PDF reports
5. **Email Reports** - Send results via email
6. **Comparison** - Compare multiple interview attempts

---

All interview data is now automatically saved to MongoDB for future reference and analysis! 🎯
