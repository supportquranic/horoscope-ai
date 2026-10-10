import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import connectMongo from '../../../../lib/mongodb';
import HoroscopeReading from '../../../../models/HoroscopeReading';

const SYSTEM_PROMPT = `You are Orbit's reflection and daily horoscope guide. Write warm, grounded, and insightful reflection horoscopes based on the user's zodiac sign, goals, challenge, and situation.
CRITICAL RULES:
- Never claim to predict the future or make absolute superstitious claims. Orbit is for reflection and thoughtful personal insight.
- Write in natural, clear, plain English.
- Return structured JSON covering three timeframes ("today", "tomorrow", "month") with four categories ("overview", "love", "career", "growth").
- For each category, provide:
  - "description": 2-3 engaging, warm, insightful sentences in plain English
  - "rating": an integer from 3 to 5 (representing cosmic alignment stars)
  - "title": a clear human-readable title (e.g., "General Overview", "Love & Relationships" or "Love & Sex", "Career & Ambition", "Personal Growth & Wellness")`;

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }
    const { userData = {}, sign = "Pisces", forceRefresh = false } = body;
    const userId = userData.name ? `user_${userData.name.toLowerCase().replace(/\s+/g, '_')}` : 'default_user';

    const now = new Date();
    const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // 1. Try to fetch cached reading from MongoDB if connected
    try {
      const conn = await connectMongo();
      if (conn && !forceRefresh) {
        const cachedDoc = await HoroscopeReading.findOne({
          userId,
          sign,
          dateKey,
        }).lean();

        if (cachedDoc && cachedDoc.today && cachedDoc.today.love) {
          return NextResponse.json({
            success: true,
            cached: true,
            source: 'mongodb',
            reading: {
              today: cachedDoc.today,
              tomorrow: cachedDoc.tomorrow,
              month: cachedDoc.month,
            },
          });
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB cache lookup skipped:', dbErr.message);
    }

    // 2. Check if GEMINI_API_KEY is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim().length === 0) {
      return NextResponse.json({ useTemplate: true, reason: 'api_key_not_set' });
    }

    // 3. Generate fresh reading with Gemini
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Write a comprehensive reflection horoscope for:
Name: ${userData.name || 'Friend'}
Zodiac Sign: ${sign}
Focus: ${(userData.focus || []).join(', ') || 'General growth'}
Goal for 3 months: ${userData.goal || 'Steady progress'}
Current situation: ${userData.situation || 'Navigating day-to-day work and balance'}
Current mood: ${userData.mood || 'Reflective'}
Biggest challenge: ${userData.challenge || 'Time and focus'}
Relationship priority: ${userData.relationshipFocus || 'Close connections'}
Requested guidance tone: ${userData.tone || 'Warm and encouraging'}
Today energy/mood: ${userData.today?.energy || 'Okay'} / ${userData.today?.mood || 'Neutral'}

Respond strictly with valid JSON with this exact schema:
{
  "today": {
    "overview": { "title": "General Overview", "description": "string", "rating": 5 },
    "love": { "title": "Love & Sex", "description": "string", "rating": 5 },
    "career": { "title": "Career & Ambition", "description": "string", "rating": 4 },
    "growth": { "title": "Personal Growth & Wellness", "description": "string", "rating": 5 }
  },
  "tomorrow": {
    "overview": { "title": "Tomorrow's Energy", "description": "string", "rating": 4 },
    "love": { "title": "Love & Connections", "description": "string", "rating": 4 },
    "career": { "title": "Career & Planning", "description": "string", "rating": 5 },
    "growth": { "title": "Mindset & Rest", "description": "string", "rating": 4 }
  },
  "month": {
    "overview": { "title": "Monthly Horizon", "description": "string", "rating": 5 },
    "love": { "title": "Monthly Relationships", "description": "string", "rating": 5 },
    "career": { "title": "Monthly Career Path", "description": "string", "rating": 5 },
    "growth": { "title": "Monthly Transformation", "description": "string", "rating": 4 }
  }
}`;

      const CANDIDATE_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.5-flash'];
      let response = null;
      let lastErr = null;

      for (const modelName of CANDIDATE_MODELS) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: SYSTEM_PROMPT,
              responseMimeType: 'application/json',
            },
          });
          if (response && response.text) break;
        } catch (modelErr) {
          lastErr = modelErr;
          console.warn(`Model ${modelName} failed, trying next candidate:`, modelErr.message);
        }
      }

      if (!response && lastErr) {
        throw lastErr;
      }

      if (response && response.text) {
        const parsed = JSON.parse(response.text);

        // 4. Save to MongoDB if connected
        try {
          const conn = await connectMongo();
          if (conn) {
            await HoroscopeReading.findOneAndUpdate(
              { userId, sign, dateKey },
              {
                $set: {
                  monthKey,
                  today: parsed.today,
                  tomorrow: parsed.tomorrow,
                  month: parsed.month,
                  source: 'gemini',
                  updatedAt: new Date(),
                },
              },
              { upsert: true, new: true }
            );
          }
        } catch (saveErr) {
          console.warn('MongoDB cache save skipped:', saveErr.message);
        }

        return NextResponse.json({
          success: true,
          aiGenerated: true,
          cached: false,
          source: 'gemini',
          reading: parsed,
        });
      }
    } catch (apiErr) {
      console.warn('Gemini reading generation fallback:', apiErr.message);
      return NextResponse.json({ useTemplate: true, reason: apiErr.message });
    }

    return NextResponse.json({ useTemplate: true });
  } catch (err) {
    return NextResponse.json({ useTemplate: true, error: err.message });
  }
}
