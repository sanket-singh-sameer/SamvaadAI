# Frontend Integration Guide

## Overview

This document explains how to use the newly integrated interview constants, types, and utilities in the SamvaadAI frontend.

## Files Added

### 1. **Types** (`src/types/index.ts`)
Contains TypeScript interfaces for:
- `Interview` - Main interview data structure
- `FeedbackCategory` - Individual feedback category
- `InterviewFeedback` - Complete feedback response

### 2. **Constants** (`src/constants/interview.ts`)
Contains:
- `techStackMappings` - Map of tech stack variations to canonical names
- `interviewerConfig` - Vapi AI assistant configuration
- `feedbackSchema` - Zod schema for feedback validation
- `interviewCovers` - Array of interview cover images
- `dummyInterviews` - Sample interview data for testing

### 3. **Utilities** (`src/utils/techStack.ts`)
Helper functions for tech stack operations:
- `normalizeTechStack(tech: string)` - Normalize a single tech name
- `normalizeTechStackArray(techStack: string[])` - Normalize an array
- `getTechStackIcon(tech: string)` - Get icon path for a tech stack
- `isSupportedTechStack(tech: string)` - Check if tech is supported

### 4. **Services** (`src/services/interview.service.ts`)
API service functions:
- `createInterview()` - Create new interview with AI questions
- `getUserInterviews()` - Fetch all user interviews
- `getInterview()` - Fetch specific interview
- `deleteInterview()` - Delete an interview

## Usage Examples

### Using Tech Stack Mappings

```typescript
import { normalizeTechStack } from "@/utils/techStack";

// Normalize user input
const userInput = "react.js";
const normalized = normalizeTechStack(userInput); // Returns "react"

// Works with variations
normalizeTechStack("Next.js"); // Returns "nextjs"
normalizeTechStack("node"); // Returns "nodejs"
```

### Creating an Interview

```typescript
import { createInterview } from "@/services/interview.service";
import { normalizeTechStackArray } from "@/utils/techStack";

const techStack = ["React.js", "Node", "MongoDB"];
const normalizedStack = normalizeTechStackArray(techStack);

const response = await createInterview({
  type: "Technical",
  role: "Full Stack Developer",
  level: "Senior",
  techstack: normalizedStack.join(","),
  amount: 5,
  userid: currentUser.id,
});

if (response.success && response.data) {
  // Navigate to interview page
  navigate("/interview", { state: { interview: response.data } });
}
```

### Using Vapi AI Configuration

```typescript
import Vapi from "@vapi-ai/web";
import { interviewerConfig } from "@/constants/interview";

const vapi = new Vapi("your-public-key");

// Start interview with custom questions
const assistant = {
  ...interviewerConfig,
  model: {
    ...interviewerConfig.model,
    messages: [
      {
        ...interviewerConfig.model.messages[0],
        content: interviewerConfig.model.messages[0].content.replace(
          "{{questions}}",
          interview.questions.join("\n")
        ),
      },
    ],
  },
};

await vapi.start(assistant);
```

### Validating Feedback with Zod

```typescript
import { feedbackSchema } from "@/constants/interview";

async function processFeedback(rawFeedback: unknown) {
  try {
    const validFeedback = feedbackSchema.parse(rawFeedback);
    
    console.log("Total Score:", validFeedback.totalScore);
    console.log("Strengths:", validFeedback.strengths);
    console.log("Areas for Improvement:", validFeedback.areasForImprovement);
    
    return validFeedback;
  } catch (error) {
    console.error("Invalid feedback format:", error);
    return null;
  }
}
```

### Using Interview Types

```typescript
import type { Interview, InterviewFeedback } from "@/types";

function InterviewCard({ interview }: { interview: Interview }) {
  return (
    <div>
      <h3>{interview.role}</h3>
      <p>Level: {interview.level}</p>
      <p>Type: {interview.type}</p>
      <div>
        Tech Stack: {interview.techstack.join(", ")}
      </div>
      <p>Questions: {interview.questions.length}</p>
    </div>
  );
}
```

## Environment Variables

Add to your `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
```

## Integration with Existing Components

### PreInterview.tsx

Update the form submission to use the new service:

```typescript
import { createInterview } from "@/services/interview.service";
import { normalizeTechStackArray } from "@/utils/techStack";

const handleStart = async () => {
  if (!isReady) return;
  setLoading(true);

  // Parse tech stack from focus area
  const techStack = focusArea
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);
  
  const normalizedStack = normalizeTechStackArray(techStack);

  const response = await createInterview({
    type: "Technical",
    role,
    level: experience || "Mid-Level",
    techstack: normalizedStack.join(","),
    amount: 5,
    userid: currentUser.id,
  });

  setLoading(false);
  
  if (response.success && response.data) {
    navigate("/interview", { state: { interview: response.data } });
  }
};
```

### Interview.tsx

Use the interview data passed from PreInterview:

```typescript
import { useLocation } from "react-router-dom";
import type { Interview } from "@/types";

function Interview() {
  const location = useLocation();
  const interview = location.state?.interview as Interview | undefined;

  // Use interview.questions instead of hardcoded QUESTIONS
  const questions = interview?.questions || FALLBACK_QUESTIONS;

  // ... rest of component
}
```

## Tech Stack Icons

Store tech stack icons in `public/icons/` with names matching the normalized values:

```
public/
  icons/
    react.svg
    nextjs.svg
    nodejs.svg
    mongodb.svg
    typescript.svg
    ...
```

Access icons using the utility:

```typescript
import { getTechStackIcon } from "@/utils/techStack";

<img src={getTechStackIcon("react")} alt="React" />
```

## Dependencies Installed

- `@vapi-ai/web` - Vapi AI SDK for voice interviews
- `zod` - TypeScript-first schema validation

## Next Steps

1. Add VITE_API_URL and VITE_VAPI_PUBLIC_KEY to your `.env` file
2. Update PreInterview.tsx to use the interview service
3. Update Interview.tsx to use interview questions from state
4. Add tech stack icons to `public/icons/`
5. Integrate Vapi AI for voice interviews
6. Implement feedback collection and validation

## Support

For issues or questions, refer to:
- [Vapi AI Documentation](https://docs.vapi.ai)
- [Zod Documentation](https://github.com/colinhacks/zod)
