import { NextResponse } from 'next/server';
import connectMongo from '../../../lib/mongodb';

export async function GET() {
  let mongoStatus = 'not_configured';
  if (process.env.MONGODB_URI) {
    try {
      const conn = await connectMongo();
      mongoStatus = conn ? 'connected' : 'failed';
    } catch (err) {
      mongoStatus = 'error: ' + err.message;
    }
  }

  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);

  return NextResponse.json({
    status: 'ok',
    app: 'Orbit · Daily Horoscope & Reflection AI',
    timestamp: new Date().toISOString(),
    services: {
      backend: 'Next.js App Router (Node.js)',
      geminiApiKeyConfigured: geminiConfigured,
      mongoDbStatus: mongoStatus
    }
  });
}
