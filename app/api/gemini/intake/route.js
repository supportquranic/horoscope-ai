import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const FIXED_QUESTIONS = [
  {
    key: "name",
    question: "What should I call you?",
    type: "text",
    options: ["Star Traveler", "Seeker", "Orbit Friend"]
  },
  {
    key: "birthDate",
    question: "When were you born?",
    type: "date",
    options: ["Select your date below"]
  },
  {
    key: "birthTime",
    question: "Do you know your birth time and city? Optional.",
    type: "choice",
    options: ["Skip for now", "Morning", "Afternoon", "Night", "Exact time"]
  },
  {
    key: "focus",
    question: "Main focus right now?",
    type: "choice",
    options: ["Career", "Money", "Studies", "Love", "Health habits", "Creativity", "Peace of mind"]
  },
  {
    key: "goal",
    question: "A goal for the next 3 months?",
    type: "choice",
    options: ["Get a job or clients", "Save money", "Finish my degree", "Build a habit", "Launch a project"]
  },
  {
    key: "situation",
    question: "Current situation?",
    type: "choice",
    options: ["Studying", "Working", "Freelancing", "Running a business", "Between jobs", "Building something new"]
  },
  {
    key: "mood",
    question: "How are you feeling about life lately?",
    type: "choice",
    options: ["Motivated", "Stretched thin", "Stuck", "Uncertain", "Calm", "Excited"]
  },
  {
    key: "challenge",
    question: "Biggest challenge right now?",
    type: "choice",
    options: ["Time", "Money", "Focus", "Confidence", "Relationships", "Too many options"]
  },
  {
    key: "relationshipFocus",
    question: "Which relationships matter most right now?",
    type: "choice",
    options: ["Family", "Friends", "Partner", "Colleagues", "Clients", "Not a focus now"]
  },
  {
    key: "tone",
    question: "How do you like your guidance?",
    type: "choice",
    options: ["Short and direct", "Warm and encouraging", "Practical steps", "Reflective questions"]
  }
];

const SYSTEM_PROMPT = `You are Orbit's guide for a reflection and horoscope app. Ask ONE short question at a time in a warm, concise tone. With each question return 3 to 6 short suggestion options. Never ask for sensitive data: no medical diagnoses, exact income, passwords, ID numbers, or details about other people. Be honest that readings are for reflection and entertainment, not real astrology or predictions. If the user seems distressed or mentions self-harm, stop the questions, respond kindly, and suggest they talk to someone they trust or a local helpline. When the questions are complete, return only the structured JSON.`;

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }
    const { stepIndex = 0, answers = {} } = body;

    // Completion check
    if (stepIndex >= FIXED_QUESTIONS.length) {
      return NextResponse.json({
        isComplete: true,
        totalQuestions: FIXED_QUESTIONS.length,
        answers
      });
    }

    const currentBase = FIXED_QUESTIONS[stepIndex];

    // If Gemini API key is configured, use Gemini to adapt options
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `User answers so far: ${JSON.stringify(answers)}.
The next intake question is: "${currentBase.question}".
Provide a concise, warm version of this question and 3 to 6 relevant suggestion chips based on their prior answers.
Output strictly as JSON:
{
  "question": "string",
  "options": ["string", "string", "string"],
  "type": "${currentBase.type}"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: 'application/json'
          }
        });

        if (response && response.text) {
          const parsed = JSON.parse(response.text);
          return NextResponse.json({
            isComplete: false,
            stepIndex,
            totalQuestions: FIXED_QUESTIONS.length,
            key: currentBase.key,
            question: parsed.question || currentBase.question,
            options: Array.isArray(parsed.options) && parsed.options.length ? parsed.options : currentBase.options,
            type: currentBase.type,
            aiEnhanced: true
          });
        }
      } catch (geminiError) {
        console.warn('Gemini intake fallback to base questions:', geminiError.message);
      }
    }

    // Default built-in fallback
    return NextResponse.json({
      isComplete: false,
      stepIndex,
      totalQuestions: FIXED_QUESTIONS.length,
      key: currentBase.key,
      question: currentBase.question,
      options: currentBase.options,
      type: currentBase.type,
      aiEnhanced: false
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
