import { NextResponse } from 'next/server';
import connectMongo from '../../../lib/mongodb';
import UserIntake from '../../../models/UserIntake';

export async function GET(req) {
  try {
    const conn = await connectMongo();
    if (!conn) {
      return NextResponse.json({ success: false, reason: 'mongo_not_configured' });
    }
    const doc = await UserIntake.findOne({ userId: 'default_user' }).lean();
    return NextResponse.json({ success: true, data: doc });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }
    const conn = await connectMongo();
    if (!conn) {
      return NextResponse.json({ success: true, savedLocallyOnly: true });
    }

    const updateOps = { $set: { updatedAt: new Date() } };
    if (body.$push) {
      updateOps.$push = body.$push;
      delete body.$push;
    }
    if (Object.keys(body).length > 0) {
      Object.assign(updateOps.$set, body);
    }

    const updated = await UserIntake.findOneAndUpdate(
      { userId: body.userId || 'default_user' },
      updateOps,
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
