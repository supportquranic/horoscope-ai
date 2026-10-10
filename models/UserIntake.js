import mongoose from 'mongoose';

const UserIntakeSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'default_user' },
    name: { type: String, default: '' },
    birthDate: { type: String, default: '' },
    birthTime: { type: String, default: '' },
    birthCity: { type: String, default: '' },
    focus: { type: [String], default: [] },
    goal: { type: String, default: '' },
    situation: { type: String, default: '' },
    mood: { type: String, default: '' },
    challenge: { type: String, default: '' },
    relationshipFocus: { type: String, default: '' },
    tone: { type: String, default: 'Warm and encouraging' },
    today: {
      energy: { type: String, default: '' },
      mood: { type: String, default: '' },
      mainTask: { type: String, default: '' },
      date: { type: String, default: '' },
    },
    weeklyHistory: [
      {
        weekDate: String,
        actionCompleted: String,
        readingRelevance: String,
        goalStatus: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.UserIntake || mongoose.model('UserIntake', UserIntakeSchema);
