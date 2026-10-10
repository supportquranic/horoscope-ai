import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `You are Orbit's personal Astrologer & Cosmic Guide. 
You provide warm, deeply insightful, reflective, and empowering astrological answers to the user's questions.
Your guidance is grounded in their zodiac sign, elemental traits, and current celestial energies.
Guidelines:
- Speak directly to the user with warmth, celestial elegance, and grounded wisdom.
- Never make terrifying predictions or superstitious fatalistic claims. Orbit is for reflection, mindfulness, self-growth, and empowering cosmic perspective.
- Keep answers engaging, focused, and concise (typically 2-4 well-crafted paragraphs).
- Answer specific questions thoughtfully (relationships, career choices, emotional mood, planetary transits, decision making).`;

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }

    const { message = '', history = [], userData = {}, sign = 'Aries' } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: `As a ${sign}, your intuitive compass is pointing toward patience and grounded discernment today. Trust your natural strengths while navigating this path.`
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format chat context
    const conversationPrompt = `User Profile:
Name: ${userData.name || 'Friend'}
Zodiac Sign: ${sign}
Focus: ${(userData.focus || []).join(', ') || 'General growth'}
Goal: ${userData.goal || 'Clarity & balance'}

Conversation History:
${history.slice(-6).map((h) => `${h.role === 'user' ? 'User' : 'Orbit Astrologer'}: ${h.text}`).join('\n')}

User: ${message}

Orbit Astrologer:`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: conversationPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    const reply = response && response.text ? response.text.trim() : `The stars suggest looking inward today, ${sign}. Trust your instinctive balance.`;

    return NextResponse.json({ success: true, reply });
  } catch (err) {
    console.warn('Gemini chat error:', err.message);
    return NextResponse.json({
      success: true,
      reply: `Under current celestial aspects, reflect on what truly energizes you and protect your personal boundaries today.`
    });
  }
}
