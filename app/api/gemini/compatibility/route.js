import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Traditional Astrological Element & Triplicity Synergy Matrix
const ELEMENT_MAP = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
};

const BASE_SCORES = {
  'Fire-Fire': 88, 'Fire-Air': 92, 'Fire-Earth': 68, 'Fire-Water': 72,
  'Earth-Earth': 90, 'Earth-Water': 94, 'Earth-Air': 65,
  'Air-Air': 86, 'Air-Water': 70,
  'Water-Water': 92
};

function getBaseCompatibility(s1, s2) {
  const e1 = ELEMENT_MAP[s1] || 'Earth';
  const e2 = ELEMENT_MAP[s2] || 'Water';
  const pair1 = `${e1}-${e2}`;
  const pair2 = `${e2}-${e1}`;
  let score = BASE_SCORES[pair1] || BASE_SCORES[pair2] || 82;
  if (s1 === s2) score = 86; // Same sign synergy
  return {
    score,
    element1: e1,
    element2: e2,
    love: Math.min(98, score + 4),
    communication: Math.min(95, score - 2),
    friendship: Math.min(99, score + 2),
  };
}

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }

    const {
      person1 = { name: 'You', sign: 'Virgo', birthDate: '' },
      person2 = { name: 'Partner', sign: 'Taurus', birthDate: '' }
    } = body;

    const baseMetrics = getBaseCompatibility(person1.sign, person2.sign);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        ...baseMetrics,
        summary: `${person1.sign} and ${person2.sign} share a natural elemental harmony (${baseMetrics.element1} & ${baseMetrics.element2}). They inspire mutual growth through patience and emotional trust.`,
        strengths: ['Mutual loyalty and dependability', 'Natural communication flow', 'Shared values and goals'],
        challenges: ['Occasional stubbornness in decision-making', 'Differing paces of change'],
        advice: 'Celebrate your shared vision while honoring individual autonomy.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Perform a comprehensive astrological compatibility (synastry) reading between two people:
Person 1: ${person1.name || 'Person 1'} (${person1.sign}, born ${person1.birthDate || 'Date unspecified'})
Person 2: ${person2.name || 'Person 2'} (${person2.sign}, born ${person2.birthDate || 'Date unspecified'})

Write a thoughtful, authentic, inspiring synastry analysis.
Return strictly valid JSON with this schema:
{
  "score": ${baseMetrics.score},
  "loveScore": ${baseMetrics.love},
  "commScore": ${baseMetrics.communication},
  "friendshipScore": ${baseMetrics.friendship},
  "summary": "3-4 sentences summarizing their cosmic dynamic, elemental synergy (${baseMetrics.element1} & ${baseMetrics.element2}), and emotional chemistry.",
  "strengths": ["Key strength 1", "Key strength 2", "Key strength 3"],
  "challenges": ["Growth edge or potential tension 1", "Growth edge 2"],
  "cosmicAdvice": "2 inspiring sentences on how they can bring out the highest potential in their bond."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text);
      return NextResponse.json({
        success: true,
        score: parsed.score || baseMetrics.score,
        love: parsed.loveScore || baseMetrics.love,
        communication: parsed.commScore || baseMetrics.communication,
        friendship: parsed.friendshipScore || baseMetrics.friendship,
        summary: parsed.summary,
        strengths: parsed.strengths || [],
        challenges: parsed.challenges || [],
        advice: parsed.cosmicAdvice,
        element1: baseMetrics.element1,
        element2: baseMetrics.element2
      });
    }

    return NextResponse.json({
      success: true,
      ...baseMetrics,
      summary: `${person1.sign} and ${person2.sign} create a balanced cosmic dynamic rooted in mutual respect.`,
      strengths: ['Loyalty', 'Natural empathy', 'Shared ambitions'],
      challenges: ['Expressing vulnerabilities openly'],
      advice: 'Listen with open hearts and give each other space to flourish.'
    });
  } catch (err) {
    console.warn('Compatibility error:', err.message);
    const s1 = req?.body?.person1?.sign || 'Aries';
    const s2 = req?.body?.person2?.sign || 'Leo';
    const base = getBaseCompatibility(s1, s2);
    return NextResponse.json({
      success: true,
      ...base,
      summary: `${s1} and ${s2} possess a vibrant connection with deep potential for enduring companionship.`,
      strengths: ['Harmonious energy', 'Mutual encouragement'],
      challenges: ['Balancing independent desires'],
      advice: 'Focus on honesty and shared creative passions.'
    });
  }
}
