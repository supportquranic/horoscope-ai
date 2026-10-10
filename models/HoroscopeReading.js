import mongoose from 'mongoose';

const TopicContentSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    rating: { type: Number, default: 4 },
  },
  { _id: false }
);

const TimeframeBlockSchema = new mongoose.Schema(
  {
    overview: { type: TopicContentSchema, default: () => ({}) },
    love: { type: TopicContentSchema, default: () => ({}) },
    career: { type: TopicContentSchema, default: () => ({}) },
    growth: { type: TopicContentSchema, default: () => ({}) },
  },
  { _id: false }
);

const HoroscopeReadingSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'default_user' },
    sign: { type: String, required: true },
    dateKey: { type: String, required: true }, // e.g. "2026-10-10"
    monthKey: { type: String, required: true }, // e.g. "2026-10"
    today: { type: TimeframeBlockSchema, default: () => ({}) },
    tomorrow: { type: TimeframeBlockSchema, default: () => ({}) },
    month: { type: TimeframeBlockSchema, default: () => ({}) },
    source: { type: String, default: 'gemini' }, // 'gemini' | 'template'
  },
  { timestamps: true }
);

// Compound index for instant single-query lookup
HoroscopeReadingSchema.index({ userId: 1, sign: 1, dateKey: 1 });

export default mongoose.models.HoroscopeReading || mongoose.model('HoroscopeReading', HoroscopeReadingSchema);
