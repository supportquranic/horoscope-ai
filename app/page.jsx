'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

const SIGNS = [
  { n: "Aries", s: "♈", e: "Fire", p: "Mars", d: "Mar 21 – Apr 19" },
  { n: "Taurus", s: "♉", e: "Earth", p: "Venus", d: "Apr 20 – May 20" },
  { n: "Gemini", s: "♊", e: "Air", p: "Mercury", d: "May 21 – Jun 20" },
  { n: "Cancer", s: "♋", e: "Water", p: "the Moon", d: "Jun 21 – Jul 22" },
  { n: "Leo", s: "♌", e: "Fire", p: "the Sun", d: "Jul 23 – Aug 22" },
  { n: "Virgo", s: "♍", e: "Earth", p: "Mercury", d: "Aug 23 – Sep 22" },
  { n: "Libra", s: "♎", e: "Air", p: "Venus", d: "Sep 23 – Oct 22" },
  { n: "Scorpio", s: "♏", e: "Water", p: "Pluto", d: "Oct 23 – Nov 21" },
  { n: "Sagittarius", s: "♐", e: "Fire", p: "Jupiter", d: "Nov 22 – Dec 21" },
  { n: "Capricorn", s: "♑", e: "Earth", p: "Saturn", d: "Dec 22 – Jan 19" },
  { n: "Aquarius", s: "♒", e: "Air", p: "Uranus", d: "Jan 20 – Feb 18" },
  { n: "Pisces", s: "♓", e: "Water", p: "Neptune", d: "Feb 19 – Mar 20" },
];

const CUT = [
  [1, 20, "Aquarius"], [2, 19, "Pisces"], [3, 21, "Aries"], [4, 20, "Taurus"],
  [5, 21, "Gemini"], [6, 21, "Cancer"], [7, 23, "Leo"], [8, 23, "Virgo"],
  [9, 23, "Libra"], [10, 23, "Scorpio"], [11, 22, "Sagittarius"], [12, 22, "Capricorn"]
];

const FIXED_QUESTIONS = [
  {
    key: "name",
    question: "What should I call you?",
    type: "text",
    options: ["Friend", "Seeker", "Traveler"]
  },
  {
    key: "birthDate",
    question: "When were you born?",
    type: "date",
    options: []
  },
  {
    key: "birthTime",
    question: "Do you know your birth time and city? Optional.",
    type: "choice",
    options: ["Skip", "Morning", "Afternoon", "Night", "Exact time"]
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

const T = {
  Fire: {
    opener: [
      "Your energy runs high today, {sign}. Small, bold moves will carry more weight than big plans.",
      "There is momentum for {sign} today, but it works best when you pause long enough to choose a direction.",
      "The day rewards courage. Move with intention rather than speed."
    ],
    career: [
      "Speak up where decisions are made; your clarity will be noticed.",
      "Start the task you have been circling. Ten honest minutes will break the resistance.",
      "A small leadership moment may appear unannounced. Say yes to it."
    ],
    rel: [
      "Warmth opens doors today. Lead with curiosity before opinions.",
      "Someone close may need your enthusiasm more than your advice.",
      "Direct, kind honesty will land well. Skip the hint and say the thing."
    ],
    growth: [
      "Treat patience as a strength. Slowing down is not losing ground.",
      "Channel restless energy into movement: a walk, a workout, a clean desk.",
      "Notice where you rush to win. Today, aim to understand instead."
    ]
  },
  Earth: {
    opener: [
      "Steady, grounded energy surrounds {sign} today. Quiet consistency is your real strength.",
      "The day favours what is built slowly. Trust the foundations you have been laying.",
      "Your practical instincts are sharp today. Let them guide you past the noise."
    ],
    career: [
      "Finish one thing properly rather than starting three. Quality gets noticed.",
      "A detail others overlook is the key to progress. You will spot it.",
      "Review your plan and tighten it; a small adjustment now saves hours later."
    ],
    rel: [
      "Show care through reliable actions: a message, a favour, showing up on time.",
      "Give someone you love ten minutes of full attention. It means more than a grand gesture.",
      "Be patient with a slow conversation; do not force a conclusion."
    ],
    growth: [
      "Make space for rest without guilt. Rest is part of the work.",
      "Simplify one corner of your life: a drawer, a habit, a commitment.",
      "Allow yourself to enjoy the progress you have already made."
    ]
  },
  Air: {
    opener: [
      "Your mind is quick and curious today, {sign}. Ideas arrive faster than you can write them down.",
      "Conversation is your doorway today. Good questions will take you further than good answers.",
      "Plenty of possibilities are open; choose one thread to follow and let the rest wait."
    ],
    career: [
      "Share an idea early, even half-formed. Feedback will sharpen it quickly.",
      "Connect two people or concepts that have not met. That bridge is your value today.",
      "Write it down. A clear outline turns scattered thoughts into a plan."
    ],
    rel: [
      "Listen for what is not said. A pause may tell you more than the words.",
      "Reach out to someone you have not spoken to lately; a light message is enough.",
      "Balance talking with listening today, and the conversation will deepen."
    ],
    growth: [
      "Give your mind an hour away from screens; clarity follows quiet.",
      "Pick one question to sit with, and resist solving it immediately.",
      "Notice when you overthink, then take one small step instead."
    ]
  },
  Water: {
    opener: [
      "Your intuition runs deep today, {sign}. Trust the quiet signals you usually dismiss.",
      "The emotional tide is gentle but meaningful. Moving with it works better than pushing against it.",
      "Feelings carry information today. Listen first, then decide."
    ],
    career: [
      "Trust your read of a person or situation; your instincts are well tuned.",
      "Work somewhere calm today. Your best output comes without pressure.",
      "A creative or caring approach will solve a problem logic alone cannot."
    ],
    rel: [
      "Be honest about how you feel, softly but clearly. It will bring someone closer.",
      "Protect your energy: kind boundaries are an act of care, not distance.",
      "A small act of empathy will ripple further than you expect."
    ],
    growth: [
      "Journal a few lines tonight. Naming a feeling reduces its weight.",
      "Let yourself release one worry you have been carrying for others.",
      "Spend a little time near water, music, or silence to reset."
    ]
  }
};

const GOAL = [
  "Your goal, “{g}”, is well placed to benefit: choose the smallest step toward it and take it before the day ends.",
  "With “{g}” on your mind, today favours steady effort over perfect timing.",
  "Keep “{g}” in view today; one concrete action matters more than a long plan."
];

const SIT = [
  "You mentioned: “{s}”. Be gentle with yourself there; this is a chapter, not the whole story.",
  "Given your situation (“{s}”), focus on what is in your control today and let the rest settle.",
  "About “{s}”: small, honest steps will serve you better than waiting for perfect clarity."
];

const NOTE = [
  "One of your saved notes says “{n}”. Let it quietly shape your choices today.",
  "You noted “{n}”. Today is a good day to act on that."
];

const MOODS = ["Focused", "Reflective", "Energised", "Calm", "Curious", "Hopeful", "Determined"];
const COLORS = ["Blue", "Green", "Silver", "Navy", "Teal", "Gold"];

const ACTIONS = {
  career: [
    "Spend 25 focused minutes on the most important task for your career goal, with your phone out of reach.",
    "Send one message to someone who could help your career: a question, a thank-you, or a small update.",
    "Write down three skills you want to build this month, then practise one for 15 minutes."
  ],
  money: [
    "Review your last week of spending and pick one small expense to cut or pause.",
    "Move a small, fixed amount into savings right now, even if it is tiny.",
    "Write your money goal as a number and a date, and put it where you will see it."
  ],
  health: [
    "Take a 20-minute walk without headphones and notice how your body feels.",
    "Drink a full glass of water now and prepare something healthy for later.",
    "Do 10 minutes of gentle stretching before bed to tell your body the day is done."
  ],
  learning: [
    "Study for one 25-minute block, then write three things you learned in your own words.",
    "Explain what you learned this week out loud, as if teaching a friend.",
    "Choose one topic, collect two good resources, and read the first page of one."
  ],
  creative: [
    "Make something small and imperfect for 20 minutes. Do not edit, just finish.",
    "Collect three images or ideas that inspire you and note why each caught your eye.",
    "Share one piece of work with someone you trust and ask for one honest observation."
  ],
  relationships: [
    "Send a sincere message to someone you care about, with no agenda attached.",
    "Give one person your full attention for ten minutes, phone away.",
    "Write down what you appreciate about someone close, then tell them one line of it."
  ],
  calm: [
    "Take five slow breaths, then write the three tasks that truly matter today.",
    "Switch off notifications for an hour and do one thing at a time.",
    "Before sleep, write what went well today and one thing you can leave until tomorrow."
  ],
  general: [
    "Pick the one thing you will be glad you did by tonight, and do it first.",
    "Tidy your workspace for ten minutes, then start your next task fresh.",
    "Write down one goal for this week and its very first step. Then do that step."
  ]
};

const KEYS = {
  career: ["job", "career", "work", "promotion", "business", "client", "freelance", "interview", "launch", "startup", "portfolio"],
  money: ["money", "save", "saving", "debt", "income", "budget", "invest", "rich", "earn"],
  health: ["health", "fit", "gym", "weight", "exercise", "run", "sleep", "diet", "workout", "habit"],
  learning: ["learn", "study", "exam", "degree", "course", "skill", "read", "university", "grade"],
  creative: ["design", "art", "write", "create", "music", "creative", "draw", "paint", "book"],
  relationships: ["love", "relationship", "friend", "family", "partner", "marriage", "dating", "social"],
  calm: ["stress", "anxiety", "calm", "balance", "burnout", "peace", "focus", "overwhelm"]
};

const CAT = {
  career: "career",
  money: "money",
  health: "health",
  learning: "learning",
  creative: "creative work",
  relationships: "relationships",
  calm: "calm and focus",
  general: "general wellbeing"
};

const K = {
  profile: "orbit_profile",
  intake: "orbit_intake",
  notes: "orbit_notes",
  state: "orbit_state",
  checkin: "orbit_checkin",
  weekly: "orbit_weekly"
};

const READING_TOPICS = [
  { id: "overview", icon: "pie_chart", label: "Overview", title: "General Overview" },
  { id: "love", icon: "favorite", label: "Love & Sex", title: "Love & Sex" },
  { id: "career", icon: "work", label: "Career & Ambition", title: "Career & Ambition" },
  { id: "growth", icon: "eco", label: "Personal Growth & Wellness", title: "Personal Growth & Wellness" },
];

function TwinHeartsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="currentColor" style={{ overflow: "visible" }}>
      <path d="M9.5 6C7 6 5 8 5 10.5c0 4.2 5 7.8 7.3 9.4.4.3 1 .3 1.4 0 1-.7 2.4-1.8 3.6-3.1-.7-.8-1.1-1.8-1.1-2.9 0-2.4 2-4.4 4.4-4.4.6 0 1.2.1 1.7.4-.7-2.2-2.8-3.9-5.3-3.9-1.5 0-2.8.7-3.7 1.8-.9-1.1-2.2-1.8-3.8-1.8z" />
      <path d="M21 11c-1.5 0-2.7 1.2-2.7 2.7 0 2.7 3.3 5.2 4.8 6.3.3.2.7.2 1 0 1.5-1.1 4.8-3.6 4.8-6.3 0-1.5-1.2-2.7-2.7-2.7-1 0-1.8.5-2.2 1.3-.4-.8-1.2-1.3-2.2-1.3z" opacity="0.95" />
    </svg>
  );
}

function renderStars(rating = 4) {
  const stars = [];
  const safe = Math.max(1, Math.min(5, Math.round(rating || 4)));
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`ms fill ${i <= safe ? "star-active" : "star-dim"}`}
        aria-hidden="true"
      >
        star
      </span>
    );
  }
  return stars;
}

function loadLocal(k, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveLocal(k, v) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {}
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(r, a) {
  return a[Math.floor(r() * a.length)];
}

function clip(t, n) {
  t = (t || "").replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n - 1) + "…" : t;
}

function signFromDate(v) {
  if (!v) return "";
  const p = v.split("-");
  if (p.length < 3) return "";
  const m = +p[1], d = +p[2];
  if (isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) return "";
  let res = "Capricorn";
  CUT.forEach((c) => {
    if (m > c[0] || (m === c[0] && d >= c[1])) res = c[2];
  });
  return res;
}

function signObj(n) {
  return SIGNS.find((s) => s.n === n) || SIGNS[11];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const YEAR_LIST = Array.from({ length: 2026 - 1930 + 1 }, (_, i) => 2026 - i);

function parseBirthDate(val) {
  if (val && typeof val === "string") {
    const parts = val.split("-");
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d) && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        return { year: y, month: m, day: d, isSet: true };
      }
    }
  }
  return { year: 2000, month: 8, day: 23, isSet: false };
}

function getRolledDate(baseYear, baseMonth, baseDay, offsetDays) {
  const d = new Date(baseYear, baseMonth - 1, baseDay + offsetDays);
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    weekday: WEEKDAY_NAMES[d.getDay()]
  };
}

function getDaySlot(year, month, day, k) {
  const maxDays = new Date(year, month, 0).getDate();
  if (k === 0) {
    const dObj = new Date(year, month - 1, day);
    return { type: 'day', year, month, day, weekday: WEEKDAY_NAMES[dObj.getDay()] };
  }
  if (k > 0) {
    const remainingInMonth = maxDays - day;
    if (k <= remainingInMonth) {
      const targetDay = day + k;
      const dObj = new Date(year, month - 1, targetDay);
      return { type: 'day', year, month, day: targetDay, weekday: WEEKDAY_NAMES[dObj.getDay()] };
    }
    if (k === remainingInMonth + 1) {
      return { type: 'empty' };
    }
    const offsetInNext = k - remainingInMonth - 1;
    const nextDate = new Date(year, month, offsetInNext);
    return {
      type: 'day',
      year: nextDate.getFullYear(),
      month: nextDate.getMonth() + 1,
      day: nextDate.getDate(),
      weekday: WEEKDAY_NAMES[nextDate.getDay()]
    };
  }
  // k < 0
  const absK = Math.abs(k);
  if (absK < day) {
    const targetDay = day + k;
    const dObj = new Date(year, month - 1, targetDay);
    return { type: 'day', year, month, day: targetDay, weekday: WEEKDAY_NAMES[dObj.getDay()] };
  }
  if (absK === day) {
    return { type: 'empty' };
  }
  const offsetInPrev = absK - day - 1;
  const prevMonthLastDate = new Date(year, month - 1, 0);
  const targetDay = prevMonthLastDate.getDate() - offsetInPrev;
  const prevDate = new Date(prevMonthLastDate.getFullYear(), prevMonthLastDate.getMonth(), targetDay);
  return {
    type: 'day',
    year: prevDate.getFullYear(),
    month: prevDate.getMonth() + 1,
    day: prevDate.getDate(),
    weekday: WEEKDAY_NAMES[prevDate.getDay()]
  };
}

function getMonthSlot(month, k) {
  if (k === 0) return { type: 'month', month };
  if (k > 0) {
    const remainingInYear = 12 - month;
    if (k <= remainingInYear) return { type: 'month', month: month + k };
    if (k === remainingInYear + 1) return { type: 'empty' };
    const offset = k - remainingInYear - 1;
    return { type: 'month', month: offset };
  }
  // k < 0
  const absK = Math.abs(k);
  if (absK < month) return { type: 'month', month: month + k };
  if (absK === month) return { type: 'empty' };
  const offset = absK - month - 1;
  return { type: 'month', month: 12 - offset };
}

function hour(r) {
  const h = Math.floor(r() * 12) + 1;
  const m = Math.floor(r() * 12) * 5;
  return `${h}:${m < 10 ? "0" : ""}${m} ${r() > 0.5 ? "PM" : "AM"}`;
}

export default function OrbitApp() {
  const [view, setView] = useState("home");
  const [profile, setProfile] = useState({ birth: "", sign: "", goals: "", situation: "" });
  const [intake, setIntake] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    focus: [],
    goal: "",
    situation: "",
    mood: "",
    challenge: "",
    relationshipFocus: "",
    tone: "Warm and encouraging"
  });
  const [notes, setNotes] = useState([]);
  const [state, setState] = useState({ variant: 0, actionDate: "", actionVariant: 0, actionDone: false });
  const [checkin, setCheckin] = useState({ energy: "Okay", mood: "Good", mainTask: "", date: "" });
  const [weekly, setWeekly] = useState({ lastDone: "", answered: false });

  // Profile Calendar Widget state
  const [calendarTab, setCalendarTab] = useState("day"); // "day" | "month" | "year"
  const calDragRef = useRef({ startX: 0, deltaX: 0, isDragging: false });
  const [calDragOffset, setCalDragOffset] = useState(0);
  const [isCalDragging, setIsCalDragging] = useState(false);

  const [deckIndex, setDeckIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [toast, setToast] = useState({ show: false, text: "" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReading, setAiReading] = useState(null);

  // Timeframe tabs ("today", "tomorrow", "month") and category squircles ("overview", "love", "career", "growth")
  const [timeframe, setTimeframe] = useState("today");
  const [readingTopic, setReadingTopic] = useState("love");

  // Intake chat states
  const [intakeStep, setIntakeStep] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [intakeInput, setIntakeInput] = useState("");
  const [currentQuestionData, setCurrentQuestionData] = useState(FIXED_QUESTIONS[0]);

  const toastTimer = useRef(null);
  const showSnack = useCallback((msg) => {
    setToast({ show: true, text: msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast({ show: false, text: "" });
    }, 2800);
  }, []);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    const loadedProf = loadLocal(K.profile, { birth: "", sign: "", goals: "", situation: "" });
    const loadedIntake = loadLocal(K.intake, null);
    const loadedNotes = loadLocal(K.notes, []);
    const loadedState = loadLocal(K.state, { variant: 0, actionDate: "", actionVariant: 0, actionDone: false });
    const loadedCheckin = loadLocal(K.checkin, { energy: "Okay", mood: "Good", mainTask: "", date: "" });
    const loadedWeekly = loadLocal(K.weekly, { lastDone: "", answered: false });

    setProfile(loadedProf);
    setNotes(loadedNotes);
    setState(loadedState);
    setCheckin(loadedCheckin);
    setWeekly(loadedWeekly);

    if (loadedIntake) {
      setIntake(loadedIntake);
    }

    const activeSign = loadedProf.sign || (loadedProf.birth ? signFromDate(loadedProf.birth) : "Aries");
    const idx = SIGNS.findIndex((s) => s.n === activeSign);
    if (idx !== -1) setDeckIndex(idx);
  }, []);

  const changeView = (v) => {
    setView(v);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Build template reading
  const buildReading = useCallback(() => {
    const sample = !profile.sign;
    const name = profile.sign || "Pisces";
    const sg = signObj(name);
    const r = rng(hash(`${todayKey()}|${name}|${state.variant}|${profile.goals}|${profile.situation}|${notes.length}`));
    const t = T[sg.e] || T.Water;

    let summary = pick(r, t.opener).replace("{sign}", name);
    let career = pick(r, t.career);
    let rel = pick(r, t.rel);
    let growth = pick(r, t.growth);

    const goal = clip(intake.goal || profile.goals, 70);
    const sit = clip(intake.situation || profile.situation, 70);
    const chal = clip(intake.challenge, 60);
    const note = notes.length ? clip(notes[Math.floor(r() * notes.length)].text, 70) : "";

    if (goal) {
      summary += " " + pick(r, GOAL).replace("{g}", goal);
      career += ` Keep “${goal}” in mind as you choose where to put your effort.`;
    }
    if (sit) {
      rel += " " + pick(r, SIT).replace("{s}", sit);
    }
    if (chal) {
      growth += ` Working through “${chal}” will strengthen your resolve today.`;
    }
    if (note) {
      growth += " " + pick(r, NOTE).replace("{n}", note);
    }

    return {
      sign: sg,
      sample,
      summary,
      career,
      rel,
      growth,
      mood: pick(r, MOODS),
      num: Math.floor(r() * 99) + 1,
      color: pick(r, COLORS),
      hour: hour(r),
      used: {
        goal: !!goal,
        sit: !!sit,
        challenge: !!chal,
        notes: notes.length,
        birth: profile.birth || intake.birthDate
      }
    };
  }, [profile, intake, state.variant, notes]);

  const reading = buildReading();

  // Get active reading matching timeframe and category (AI if available, else rich template fallback)
  const getCurrentReading = useCallback(() => {
    // 1. If AI response has this timeframe & category
    if (aiReading && aiReading[timeframe] && aiReading[timeframe][readingTopic]) {
      const item = aiReading[timeframe][readingTopic];
      return {
        title: item.title || (readingTopic === "love" ? "Love & Sex" : "Daily Reflection"),
        description: item.description || "",
        rating: item.rating || 4,
        isAi: true
      };
    }

    // 2. High-quality offline template reading
    const signName = profile.sign || SIGNS[deckIndex]?.n || "Pisces";
    const r = rng(hash(`${todayKey()}|${signName}|${timeframe}|${readingTopic}|${state.variant}|${profile.goals}|${notes.length}`));

    const titles = {
      overview: {
        today: "General Overview",
        tomorrow: "Tomorrow's Energy",
        month: "Monthly Horizon"
      },
      love: {
        today: "Love & Sex",
        tomorrow: "Love & Connections",
        month: "Monthly Relationships"
      },
      career: {
        today: "Career & Ambition",
        tomorrow: "Career & Planning",
        month: "Monthly Career Path"
      },
      growth: {
        today: "Personal Growth & Wellness",
        tomorrow: "Mindset & Rest",
        month: "Monthly Transformation"
      }
    };

    const ratings = {
      overview: { today: 5, tomorrow: 4, month: 5 },
      love: { today: 4, tomorrow: 4, month: 5 },
      career: { today: 4, tomorrow: 5, month: 4 },
      growth: { today: 5, tomorrow: 4, month: 5 }
    };

    const activeTitle = titles[readingTopic]?.[timeframe] || "Daily Reflection";
    const activeRating = ratings[readingTopic]?.[timeframe] || 4;

    const goalStr = (intake.goal || profile.goals || "").trim();
    const sitStr = (intake.situation || profile.situation || "").trim();
    const chalStr = (intake.challenge || "").trim();

    let desc = "";

    if (readingTopic === "love") {
      if (timeframe === "today") {
        const baseLove = [
          "If you want to challenge your ability to defend what you truly care about, practice healthy boundaries in your significant relationships. You get to articulate the level of commitment you want. Be brave and do it.",
          "Clear, tender honesty brings genuine closeness today. Don't leave your expectations unsaid—expressing what you need builds deeper safety and mutual respect.",
          "Emotional clarity clears away hesitation today. When you honor your own authentic pace, you invite true intimacy and connection to flourish."
        ];
        desc = pick(r, baseLove);
        if (sitStr) {
          desc += ` Remember in your current situation: you deserve relationships that bring clarity, not confusion.`;
        }
      } else if (timeframe === "tomorrow") {
        desc = "Tomorrow asks for open-hearted listening. Pay close attention to subtle cues in conversations with those who matter most. Gentle patience will bridge unexpected gaps.";
      } else {
        desc = "This month invites a deeper emotional foundation. Release old defensive walls and invest in bonds that reciprocate your genuine warmth. You are worthy of love that feels like steady ground.";
      }
    } else if (readingTopic === "overview") {
      if (timeframe === "today") {
        desc = reading.summary || `Today encourages grounded awareness for ${signName}. Trust your instincts, take measured steps, and remain anchored in what brings genuine calm.`;
      } else if (timeframe === "tomorrow") {
        desc = `Tomorrow brings a refreshed mental slate for ${signName}. Pacing yourself early will keep your stamina resilient when key opportunities arise.`;
      } else {
        desc = `This month marks a transformative cycle of personal alignment. Prioritize your inner integrity over temporary approval, and watch your confidence compound day by day.`;
      }
    } else if (readingTopic === "career") {
      if (timeframe === "today") {
        desc = reading.career || `Focus your energy on one impactful priority rather than scattering your efforts. Consistent, thoughtful craftsmanship will yield far greater satisfaction today.`;
        if (goalStr) {
          desc += ` Keep your goal of “${clip(goalStr, 50)}” close as you choose where to direct your focus.`;
        }
      } else if (timeframe === "tomorrow") {
        desc = "Set clear boundaries around your work energy tomorrow. Outlining your priorities ahead of time will eliminate unnecessary hesitation and friction.";
      } else {
        desc = "Strategic patience will reward you this month. Trust the compounding value of your daily dedication; real recognition follows consistent, honest craftsmanship.";
      }
    } else if (readingTopic === "growth") {
      if (timeframe === "today") {
        desc = reading.growth || `Give yourself permission to pause and breathe today. Nurturing your nervous system is just as vital as checking tasks off your list.`;
        if (chalStr) {
          desc += ` Working mindfully through “${clip(chalStr, 50)}” is quietly strengthening your inner resolve.`;
        }
      } else if (timeframe === "tomorrow") {
        desc = "Mental clarity returns as soon as you step away from excessive digital noise. Protect tomorrow evening for restorative quiet or gentle grounding.";
      } else {
        desc = "This month centers on releasing self-criticism. Celebrate how far you have already come, and allow yourself the grace to learn through experience.";
      }
    }

    return {
      title: activeTitle,
      description: desc,
      rating: activeRating,
      isAi: false
    };
  }, [aiReading, timeframe, readingTopic, profile, intake, deckIndex, state.variant, notes, reading]);

  const currentReading = getCurrentReading();

  // Daily Action calculation
  const getAction = useCallback(() => {
    // If user set a specific mainTask today, feature it!
    if (checkin.date === todayKey() && checkin.mainTask) {
      return {
        text: `Today's priority: ${checkin.mainTask}`,
        cat: "personal",
        personal: true
      };
    }

    const g = `${intake.goal} ${intake.challenge} ${profile.goals} ${profile.situation} ${notes.map((n) => n.text).join(" ")}`.toLowerCase();
    let m = Object.keys(KEYS).filter((c) => KEYS[c].some((k) => g.includes(k)));
    if (!m.length) m = ["general"];
    const cat = m[state.actionVariant % m.length];
    const list = ACTIONS[cat] || ACTIONS.general;
    return {
      text: list[(hash(todayKey() + cat) + state.actionVariant) % list.length],
      cat,
      personal: m[0] !== "general"
    };
  }, [profile, intake, notes, state.actionVariant, checkin]);

  const action = getAction();

  // Greeting
  const currentHour = typeof window !== 'undefined' ? new Date().getHours() : 12;
  const timeGreeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";
  const userDisplayName = intake.name ? `${intake.name}` : "Friend";
  const todayLabel = typeof window !== 'undefined'
    ? new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
    : "";

  // 3D Deck swipe gestures
  const wrapperRef = useRef(null);
  const dragRef = useRef({ startX: 0, deltaX: 0, isDragging: false });

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragRef.current.startX = e.touches[0].clientX;
      dragRef.current.deltaX = 0;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - dragRef.current.startX;
      dragRef.current.deltaX = dx;
      const damped = Math.sign(dx) * Math.min(Math.abs(dx), 130);
      setDragOffset(damped);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragOffset(0);
    const dx = dragRef.current.deltaX;
    if (dx > 36) {
      stepDeck(-1);
    } else if (dx < -36) {
      stepDeck(1);
    }
    dragRef.current.deltaX = 0;
  };

  const handleMouseDown = (e) => {
    dragRef.current.isDragging = true;
    setIsDragging(true);
    dragRef.current.startX = e.clientX;
    dragRef.current.deltaX = 0;
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.deltaX = dx;
    const damped = Math.sign(dx) * Math.min(Math.abs(dx), 130);
    setDragOffset(damped);
  };

  const handleMouseUp = () => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.isDragging = false;
    setIsDragging(false);
    setDragOffset(0);
    const dx = dragRef.current.deltaX;
    if (dx > 36) {
      stepDeck(-1);
    } else if (dx < -36) {
      stepDeck(1);
    }
    dragRef.current.deltaX = 0;
  };

  const stepDeck = (direction) => {
    const total = SIGNS.length;
    setDeckIndex((prev) => {
      const next = (prev + direction + total) % total;
      setProfile((p) => ({ ...p, sign: SIGNS[next].n }));
      return next;
    });
  };

  const selectSignCard = (idx) => {
    setDeckIndex(idx);
    setProfile((p) => ({ ...p, sign: SIGNS[idx].n }));
  };

  const currentBirthParts = parseBirthDate(profile.birth || intake.birthDate);
  const detectedBirthSign = signFromDate(
    `${currentBirthParts.year}-${String(currentBirthParts.month).padStart(2, "0")}-${String(currentBirthParts.day).padStart(2, "0")}`
  );
  const detectedSignInfo = signObj(detectedBirthSign || profile.sign || "Virgo");

  const updateBirthDate = (newY, newM, newD) => {
    const maxD = new Date(newY, newM, 0).getDate();
    const clampedD = Math.min(newD, maxD);
    const dateStr = `${newY}-${String(newM).padStart(2, "0")}-${String(clampedD).padStart(2, "0")}`;
    const detected = signFromDate(dateStr);
    const newProf = { ...profile, birth: dateStr };
    if (detected) {
      newProf.sign = detected;
      const idx = SIGNS.findIndex((s) => s.n === detected);
      if (idx !== -1) setDeckIndex(idx);
    }
    setProfile(newProf);
  };

  const stepCalItem = (direction) => {
    if (calendarTab === "day") {
      const rolled = getRolledDate(currentBirthParts.year, currentBirthParts.month, currentBirthParts.day, direction);
      updateBirthDate(rolled.year, rolled.month, rolled.day);
    } else if (calendarTab === "month") {
      const nextM = ((currentBirthParts.month - 1 + direction) % 12 + 12) % 12 + 1;
      updateBirthDate(currentBirthParts.year, nextM, currentBirthParts.day);
    } else if (calendarTab === "year") {
      const nextY = Math.max(1930, Math.min(2026, currentBirthParts.year + direction));
      updateBirthDate(nextY, currentBirthParts.month, currentBirthParts.day);
    }
  };

  const handleCalTouchStart = (e) => {
    if (e.touches.length === 1) {
      calDragRef.current.startX = e.touches[0].clientX;
      calDragRef.current.currentX = e.touches[0].clientX;
      calDragRef.current.isDragging = true;
      setIsCalDragging(true);
    }
  };

  const handleCalTouchMove = (e) => {
    if (!calDragRef.current.isDragging || e.touches.length !== 1) return;
    const x = e.touches[0].clientX;
    calDragRef.current.currentX = x;
    const dx = x - calDragRef.current.startX;
    const damped = Math.sign(dx) * Math.min(Math.abs(dx), 110);
    setCalDragOffset(damped);
  };

  const handleCalTouchEnd = () => {
    if (!calDragRef.current.isDragging) return;
    calDragRef.current.isDragging = false;
    setIsCalDragging(false);
    setCalDragOffset(0);
    const dx = calDragRef.current.currentX - calDragRef.current.startX;
    const stepCount = Math.round(dx / 44);
    if (stepCount !== 0) {
      stepCalItem(-stepCount);
    } else if (dx > 16) {
      stepCalItem(-1);
    } else if (dx < -16) {
      stepCalItem(1);
    }
    calDragRef.current.startX = 0;
    calDragRef.current.currentX = 0;
  };

  const handleCalMouseDown = (e) => {
    calDragRef.current.startX = e.clientX;
    calDragRef.current.currentX = e.clientX;
    calDragRef.current.isDragging = true;
    setIsCalDragging(true);
  };

  const handleCalMouseMove = (e) => {
    if (!calDragRef.current.isDragging) return;
    const x = e.clientX;
    calDragRef.current.currentX = x;
    const dx = x - calDragRef.current.startX;
    const damped = Math.sign(dx) * Math.min(Math.abs(dx), 110);
    setCalDragOffset(damped);
  };

  const handleCalMouseUp = () => {
    if (!calDragRef.current.isDragging) return;
    calDragRef.current.isDragging = false;
    setIsCalDragging(false);
    setCalDragOffset(0);
    const dx = calDragRef.current.currentX - calDragRef.current.startX;
    const stepCount = Math.round(dx / 44);
    if (stepCount !== 0) {
      stepCalItem(-stepCount);
    } else if (dx > 16) {
      stepCalItem(-1);
    } else if (dx < -16) {
      stepCalItem(1);
    }
    calDragRef.current.startX = 0;
    calDragRef.current.currentX = 0;
  };

  const getArchItems = () => {
    if (calendarTab === "day") {
      const offsets = [-3, -2, -1, 0, 1, 2, 3];
      return offsets.map((k) => {
        const slot = getDaySlot(currentBirthParts.year, currentBirthParts.month, currentBirthParts.day, k);
        if (slot.type === 'empty') {
          return {
            k,
            isEmpty: true,
            val: `empty-${k}`,
            top: "",
            bottom: "",
            isSelected: false,
            isYear: false
          };
        }
        return {
          k,
          isEmpty: false,
          val: `${slot.year}-${slot.month}-${slot.day}`,
          slot,
          top: slot.weekday,
          bottom: String(slot.day),
          isSelected: k === 0,
          isYear: false
        };
      });
    }

    if (calendarTab === "month") {
      const offsets = [-3, -2, -1, 0, 1, 2, 3];
      return offsets.map((k) => {
        const slot = getMonthSlot(currentBirthParts.month, k);
        if (slot.type === 'empty') {
          return {
            k,
            isEmpty: true,
            val: `empty-${k}`,
            top: "",
            bottom: "",
            isSelected: false,
            isYear: false
          };
        }
        const m = slot.month;
        return {
          k,
          isEmpty: false,
          val: m,
          top: String(m).padStart(2, "0"),
          bottom: MONTH_NAMES[m - 1].slice(0, 3),
          isSelected: k === 0,
          isYear: false
        };
      });
    }

    // calendarTab === "year"
    const offsets = [-2, -1, 0, 1, 2];
    return offsets.map((k) => {
      const y = currentBirthParts.year + k;
      if (y < 1930 || y > 2026) return { k, hidden: true, isYear: true };
      return {
        k,
        isEmpty: false,
        val: y,
        top: `'${String(y).slice(-2)}`,
        bottom: String(y),
        isSelected: k === 0,
        isYear: true
      };
    });
  };

  const handleJumpToToday = () => {
    const now = new Date();
    updateBirthDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
    showSnack("Jumped to today's date");
  };

  const handleBirthChange = (e) => {
    const val = e.target.value;
    const detected = signFromDate(val);
    const newProf = { ...profile, birth: val };
    if (detected) {
      newProf.sign = detected;
      const idx = SIGNS.findIndex((s) => s.n === detected);
      if (idx !== -1) setDeckIndex(idx);
    }
    setProfile(newProf);
  };

  const saveProfileHandler = (andRead = false) => {
    let signToSave = profile.sign || SIGNS[deckIndex].n;
    if (!signToSave && profile.birth) signToSave = signFromDate(profile.birth);
    if (!signToSave) {
      showSnack("Choose a zodiac sign or enter a birth date");
      return false;
    }
    const updated = {
      ...profile,
      sign: signToSave,
      goals: (profile.goals || "").trim(),
      situation: (profile.situation || "").trim(),
    };
    setProfile(updated);
    saveLocal(K.profile, updated);
    showSnack("Profile saved");
    if (andRead) {
      changeView("reading");
      triggerGenerate();
    } else {
      changeView("home");
    }
    return true;
  };

  // Generate Reading (with Gemini if available, fallback to template)
  const triggerGenerate = async (forceRefresh = true) => {
    if (isGenerating) return;
    setIsGenerating(true);

    const shouldForce = typeof forceRefresh === 'boolean' ? forceRefresh : true;

    try {
      const res = await fetch('/api/gemini/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userData: { ...intake, today: checkin },
          sign: profile.sign || SIGNS[deckIndex].n,
          forceRefresh: shouldForce
        })
      });
      const data = await res.json();
      if (data.success && data.reading) {
        setAiReading(data.reading);
        showSnack(data.cached ? "Loaded from today's saved reading" : "✨ Gemini AI reading generated");
      } else {
        setAiReading(null);
        showSnack(data.reason ? `Template reading (${data.reason})` : "Template reading generated");
      }
    } catch (err) {
      setAiReading(null);
      showSnack("Template reading generated");
    } finally {
      setState((st) => {
        const next = { ...st, variant: st.variant + 1 };
        saveLocal(K.state, next);
        return next;
      });
      setIsGenerating(false);
    }
  };

  // Notes
  const handleAddNote = () => {
    const t = noteInput.trim();
    if (!t) {
      showSnack("Write a short note first");
      return;
    }
    const newNotes = [{ id: Date.now() + Math.random(), text: t }, ...notes];
    setNotes(newNotes);
    saveLocal(K.notes, newNotes);
    setNoteInput("");
    showSnack("Note saved");
  };

  const handleDeleteNote = (id) => {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    saveLocal(K.notes, next);
    showSnack("Note deleted");
  };

  // Daily Action toggles
  const toggleActionDone = () => {
    setState((st) => {
      const next = { ...st, actionDone: !st.actionDone };
      saveLocal(K.state, next);
      showSnack(next.actionDone ? "Action completed" : "Marked as not done");
      return next;
    });
  };

  const handleNextAction = () => {
    setState((st) => {
      const next = { ...st, actionVariant: st.actionVariant + 1, actionDone: false };
      saveLocal(K.state, next);
      showSnack("New action ready");
      return next;
    });
  };

  // Daily Check-in Save
  const handleSaveCheckin = (saveAsNote = false) => {
    const updated = { ...checkin, date: todayKey() };
    setCheckin(updated);
    saveLocal(K.checkin, updated);

    // Also sync into intake today object
    const updatedIntake = { ...intake, today: updated };
    setIntake(updatedIntake);
    saveLocal(K.intake, updatedIntake);

    if (saveAsNote && checkin.mainTask) {
      const noteText = `Today's task: ${checkin.mainTask} (Energy: ${checkin.energy}, Mood: ${checkin.mood})`;
      const newNotes = [{ id: Date.now() + Math.random(), text: noteText }, ...notes];
      setNotes(newNotes);
      saveLocal(K.notes, newNotes);
    }

    // Try background sync to MongoDB
    fetch('/api/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedIntake)
    }).catch(() => {});

    showSnack("Daily check-in saved");
  };

  // Weekly Reflection Save
  const handleWeeklySubmit = (actionComp, relev, goalStat) => {
    const rec = { weekDate: todayKey(), answered: true, actionCompleted: actionComp, readingRelevance: relev, goalStatus: goalStat };
    setWeekly(rec);
    saveLocal(K.weekly, rec);

    // Sync to MongoDB in background
    fetch('/api/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        $push: {
          weeklyHistory: {
            weekDate: todayKey(),
            actionCompleted: actionComp,
            readingRelevance: relev,
            goalStatus: goalStat
          }
        }
      })
    }).catch(() => {});

    showSnack("Weekly reflection saved. Thank you!");
  };

  // INTAKE GUIDED CHAT CONTROLLER
  const startIntake = () => {
    setIntakeStep(0);
    setCurrentQuestionData(FIXED_QUESTIONS[0]);
    setChatHistory([
      { sender: "orbit", text: "Welcome! I'm your Orbit guide. I'll ask you 10 quick questions to personalize your readings and reflections." },
      { sender: "orbit", text: FIXED_QUESTIONS[0].question, key: FIXED_QUESTIONS[0].key, options: FIXED_QUESTIONS[0].options, type: FIXED_QUESTIONS[0].type }
    ]);
    setIntakeInput("");
    changeView("intake");
  };

  const handleAnswerQuestion = async (answerVal) => {
    const qKey = currentQuestionData.key;
    const trimmed = (answerVal || "").trim() || "Skipped";

    const updatedAnswers = { ...intake, [qKey]: qKey === "focus" ? [trimmed] : trimmed };
    setIntake(updatedAnswers);
    saveLocal(K.intake, updatedAnswers);

    // If birth date was entered, also auto-update zodiac sign
    if (qKey === "birthDate" && answerVal) {
      const detected = signFromDate(answerVal);
      if (detected) {
        setProfile((p) => ({ ...p, birth: answerVal, sign: detected }));
        saveLocal(K.profile, { ...profile, birth: answerVal, sign: detected });
        const idx = SIGNS.findIndex((s) => s.n === detected);
        if (idx !== -1) setDeckIndex(idx);
      }
    }

    const nextStep = intakeStep + 1;
    setIntakeStep(nextStep);
    setIntakeInput("");

    // Append user answer to chat history
    const newHistory = [
      ...chatHistory,
      { sender: "user", text: trimmed }
    ];

    if (nextStep >= FIXED_QUESTIONS.length) {
      newHistory.push({
        sender: "orbit",
        text: `Thank you, ${updatedAnswers.name || 'Friend'}! Your profile is all set. Your daily horoscopes and actions will now reflect your journey.`
      });
      setChatHistory(newHistory);

      // Save to localStorage & MongoDB
      saveLocal(K.intake, updatedAnswers);
      const mergedProf = {
        ...profile,
        birth: updatedAnswers.birthDate || profile.birth,
        goals: updatedAnswers.goal || profile.goals,
        situation: updatedAnswers.situation || profile.situation
      };
      setProfile(mergedProf);
      saveLocal(K.profile, mergedProf);

      fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAnswers)
      }).catch(() => {});

      showSnack("Intake completed! Readings personalized.");
      setTimeout(() => {
        changeView("home");
      }, 1500);
      return;
    }

    // Next question: ask API/Gemini or fallback
    const nextBase = FIXED_QUESTIONS[nextStep];
    setCurrentQuestionData(nextBase);

    newHistory.push({
      sender: "orbit",
      text: nextBase.question,
      key: nextBase.key,
      options: nextBase.options,
      type: nextBase.type
    });
    setChatHistory(newHistory);

    // Call server intake API to see if Gemini adapts suggestions
    fetch('/api/gemini/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepIndex: nextStep, answers: updatedAnswers })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.options && data.options.length) {
          setCurrentQuestionData((prev) => ({
            ...prev,
            question: data.question || prev.question,
            options: data.options
          }));
        }
      })
      .catch(() => {});
  };

  // "Delete all my data" handler
  const handleDeleteAllData = () => {
    if (typeof window !== 'undefined') {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete all your Orbit data? This will clear your profile, intake answers, check-ins, and saved notes from this browser."
      );
      if (confirmDelete) {
        localStorage.removeItem(K.profile);
        localStorage.removeItem(K.intake);
        localStorage.removeItem(K.notes);
        localStorage.removeItem(K.state);
        localStorage.removeItem(K.checkin);
        localStorage.removeItem(K.weekly);

        setProfile({ birth: "", sign: "", goals: "", situation: "" });
        setIntake({
          name: "",
          birthDate: "",
          birthTime: "",
          focus: [],
          goal: "",
          situation: "",
          mood: "",
          challenge: "",
          relationshipFocus: "",
          tone: "Warm and encouraging"
        });
        setNotes([]);
        setState({ variant: 0, actionDate: "", actionVariant: 0, actionDone: false });
        setCheckin({ energy: "Okay", mood: "Good", mainTask: "", date: "" });
        setAiReading(null);
        showSnack("All personal data deleted");
        changeView("home");
      }
    }
  };

  // Sign hint calculation
  const autoSign = signFromDate(profile.birth || intake.birthDate);
  let signHint = "";
  if (!profile.birth && !intake.birthDate) {
    signHint = profile.sign ? `Selected sign: ${profile.sign}` : "";
  } else if (profile.sign && profile.sign === autoSign) {
    signHint = "Set from your birth date. You can swipe to change it.";
  } else if (profile.sign) {
    signHint = "Custom choice (different from birth date).";
  }

  return (
    <>
      <div className="bar">
        <div className="logo"><span className="ms fill" aria-hidden="true">brightness_2</span></div>
        <h1>Orbit</h1>
        <span className="date">{todayLabel}</span>
      </div>

      <nav className="nav" id="nav">
        <button className={view === "home" ? "active" : ""} onClick={() => changeView("home")}>
          <span className="pill"><span className="ms" aria-hidden="true">home</span></span>Home
        </button>
        <button className={view === "profile" ? "active" : ""} onClick={() => changeView("profile")}>
          <span className="pill"><span className="ms" aria-hidden="true">person</span></span>Profile
        </button>
        <button className={view === "reading" ? "active" : ""} onClick={() => changeView("reading")}>
          <span className="pill"><span className="ms" aria-hidden="true">auto_awesome</span></span>Reading
        </button>
        <button className={view === "memory" ? "active" : ""} onClick={() => changeView("memory")}>
          <span className="pill"><span className="ms" aria-hidden="true">sticky_note_2</span></span>Notes
        </button>
        <button className={view === "action" ? "active" : ""} onClick={() => changeView("action")}>
          <span className="pill"><span className="ms" aria-hidden="true">task_alt</span></span>Action
        </button>
      </nav>

      <main className="app">
        {/* INTAKE GUIDED CHAT VIEW */}
        {view === "intake" && (
          <section className="view active" id="view-intake">
            <div className="card intake-screen">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span className="label">Orbit Guide</span>
                  <h2 style={{ fontSize: "20px" }}>Personal Reflection Intake</h2>
                </div>
                <button className="btn tonal" style={{ height: "34px", padding: "0 14px", fontSize: "12px" }} onClick={() => changeView("profile")}>
                  Exit
                </button>
              </div>

              {intakeStep < FIXED_QUESTIONS.length && (
                <>
                  <div className="intake-progress-bar">
                    <div
                      className="intake-progress-fill"
                      style={{ width: `${Math.round(((intakeStep + 1) / FIXED_QUESTIONS.length) * 100)}%` }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--on-var)" }}>
                    <span>Question {intakeStep + 1} of {FIXED_QUESTIONS.length}</span>
                    <span>{Math.round(((intakeStep + 1) / FIXED_QUESTIONS.length) * 100)}%</span>
                  </div>
                </>
              )}

              {/* Chat Messages */}
              <div className="intake-messages" style={{ marginTop: "14px" }}>
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`bubble-row ${msg.sender}`}>
                    {msg.sender === "orbit" && (
                      <div className="orbit-avatar">
                        <span className="ms fill" aria-hidden="true">brightness_2</span>
                      </div>
                    )}
                    <div className={`bubble ${msg.sender}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Question Suggestion Chips */}
              {intakeStep < FIXED_QUESTIONS.length && (
                <div className="intake-controls">
                  {currentQuestionData.type === "date" ? (
                    <div style={{ marginBottom: "12px" }}>
                      <div className="field on" style={{ marginTop: "8px" }}>
                        <input
                          type="date"
                          id="intakeDate"
                          onChange={(e) => handleAnswerQuestion(e.target.value)}
                        />
                        <label htmlFor="intakeDate">Tap to choose birth date</label>
                      </div>
                    </div>
                  ) : (
                    currentQuestionData.options && currentQuestionData.options.length > 0 && (
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ fontSize: "11px", color: "var(--on-var)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: "6px" }}>
                          Quick Suggestion Chips (Tap to answer):
                        </div>
                        <div className="chip-row" style={{ marginTop: "4px" }}>
                          {currentQuestionData.options.map((opt, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="suggestion-chip"
                              onClick={() => handleAnswerQuestion(opt)}
                            >
                              <span>{opt}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}

                  {/* Text Input Row */}
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div className="field" style={{ flex: 1, marginTop: 0 }}>
                      <input
                        type="text"
                        id="chatInput"
                        placeholder=" "
                        autoComplete="off"
                        value={intakeInput}
                        onChange={(e) => setIntakeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && intakeInput.trim()) {
                            handleAnswerQuestion(intakeInput);
                          }
                        }}
                      />
                      <label htmlFor="chatInput">Or type your own answer...</label>
                    </div>

                    <button
                      className="btn filled"
                      style={{ height: "54px", padding: "0 18px", flex: "none" }}
                      onClick={() => handleAnswerQuestion(intakeInput)}
                      disabled={!intakeInput.trim()}
                    >
                      <span className="ms" aria-hidden="true">send</span>
                    </button>

                    <button
                      className="btn text"
                      style={{ height: "54px", padding: "0 10px", flex: "none", fontSize: "13px" }}
                      onClick={() => handleAnswerQuestion("Skip")}
                    >
                      Skip
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* HOME VIEW */}
        <section className={`view ${view === "home" ? "active" : ""}`} id="view-home">
          <div className="card filled">
            <div className="label">{timeGreeting}, {userDisplayName}</div>
            <h2 style={{ marginTop: "4px" }}>Welcome to Orbit</h2>
            <div className="hero">
              <div className="sign" id="signSymbol">
                <img
                  src={`/assets/signs/${reading.sign.n.toLowerCase()}.png`}
                  alt={reading.sign.n}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.textContent = reading.sign.s + '\uFE0E';
                    }
                  }}
                />
              </div>
              <div>
                <div className="sign-name">{reading.sign.n}</div>
                <div className="muted">{reading.sign.e} sign · ruled by {reading.sign.p}</div>
              </div>
            </div>
            {reading.sample && (
              <div className="banner" id="sampleNotice">
                <span className="ms" aria-hidden="true">info</span>
                <span className="t">This is a sample reading. Set up your details to personalize it.</span>
                <button className="btn text" onClick={startIntake}>Start guided intake</button>
              </div>
            )}
          </div>

          <div className="stats">
            <div className="stat"><small>Mood</small><b>{checkin.mood || reading.mood}</b></div>
            <div className="stat"><small>Lucky number</small><b>{reading.num}</b></div>
            <div className="stat"><small>Colour</small><b>{reading.color}</b></div>
            <div className="stat"><small>Best hour</small><b>{reading.hour}</b></div>
          </div>

          {/* DAILY CHECK-IN TILE */}
          <div className="checkin-card">
            <div className="checkin-title-row">
              <span className="ms fill" aria-hidden="true">today</span>
              <h3 style={{ color: "var(--on-surface)", fontSize: "16px" }}>Daily Check-in</h3>
              {checkin.date === todayKey() && (
                <span className="done-tag" style={{ marginLeft: "auto", marginTop: 0, fontSize: "12px" }}>
                  <span className="ms fill" style={{ fontSize: "16px" }} aria-hidden="true">check_circle</span>Logged today
                </span>
              )}
            </div>

            <div className="checkin-group">
              <div className="checkin-group-label">Energy Level:</div>
              <div className="tap-chips-row">
                {["Low", "Okay", "High"].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`tap-chip ${checkin.energy === lvl ? "selected" : ""}`}
                    onClick={() => setCheckin({ ...checkin, energy: lvl })}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="checkin-group">
              <div className="checkin-group-label">Current Mood:</div>
              <div className="tap-chips-row">
                {["Stressed", "Neutral", "Good", "Great"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`tap-chip ${checkin.mood === m ? "selected" : ""}`}
                    onClick={() => setCheckin({ ...checkin, mood: m })}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="checkin-group">
              <div className="checkin-group-label">The One Thing To Get Done Today:</div>
              {intake.goal && (
                <div className="tap-chips-row" style={{ marginBottom: "8px" }}>
                  <button
                    type="button"
                    className={`tap-chip ${checkin.mainTask === intake.goal ? "selected" : ""}`}
                    onClick={() => setCheckin({ ...checkin, mainTask: intake.goal })}
                  >
                    Goal: {clip(intake.goal, 28)}
                  </button>
                </div>
              )}
              <div className="field" style={{ marginTop: 0 }}>
                <input
                  type="text"
                  id="mainTaskInput"
                  placeholder=" "
                  value={checkin.mainTask || ""}
                  onChange={(e) => setCheckin({ ...checkin, mainTask: e.target.value })}
                />
                <label htmlFor="mainTaskInput">Enter your #1 priority for today...</label>
              </div>
            </div>

            <div className="row" style={{ marginTop: "14px", alignItems: "center" }}>
              <button className="btn filled" onClick={() => handleSaveCheckin(false)}>
                Save check-in
              </button>
              <button className="btn tonal" onClick={() => handleSaveCheckin(true)}>
                Save and add to notes
              </button>
            </div>
          </div>

          {/* WEEKLY REFLECTION CARD */}
          {!weekly.answered && (
            <div className="weekly-card">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--green)", marginBottom: "8px" }}>
                <span className="ms fill" aria-hidden="true">published_with_changes</span>
                <h3 style={{ color: "var(--on-surface)" }}>Weekly Follow-up</h3>
              </div>
              <p style={{ color: "var(--on-var)", fontSize: "13px", marginBottom: "12px" }}>
                A quick 1-minute check on how your week went:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <small style={{ color: "var(--on-var)", display: "block", marginBottom: "4px" }}>Did you complete your weekly action?</small>
                  <div className="tap-chips-row">
                    {["Yes", "Partly", "No"].map((opt) => (
                      <button key={opt} type="button" className="tap-chip" onClick={() => handleWeeklySubmit(opt, "Somewhat", "Keep same")}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid two" style={{ marginTop: "12px" }}>
            <div className={`card ${state.actionDone ? "done" : ""}`} id="homeActionCard">
              <div className="tile-h">
                <span className="ms" aria-hidden="true">task_alt</span>
                <h3>Today's action</h3>
                {state.actionDone && (
                  <span className="done-tag" style={{ marginLeft: "auto", marginTop: 0 }}>
                    <span className="ms fill" aria-hidden="true">check_circle</span>Done
                  </span>
                )}
              </div>
              <p className="tile-text">{action.text}</p>
              <div className="row">
                <button
                  className={`btn ${state.actionDone ? "tonal" : "filled"}`}
                  onClick={toggleActionDone}
                >
                  {state.actionDone ? "Undo" : "Mark as done"}
                </button>
                <button className="btn text" onClick={() => changeView("action")}>Details</button>
              </div>
            </div>

            <div className="card">
              <div className="tile-h">
                <span className="ms" aria-hidden="true">sticky_note_2</span>
                <h3>Notes</h3>
              </div>
              <div className="big-num">{notes.length}</div>
              <p className="muted">
                {notes.length
                  ? `Latest: ${clip(notes[0].text, 60)}`
                  : "No notes yet. Add one to personalize your readings."}
              </p>
              <div className="row">
                <button className="btn tonal" onClick={() => changeView("memory")}>Manage notes</button>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: "12px" }}>
            <div className="label">Today's horoscope</div>
            <p className="lead">{aiReading ? aiReading.summary : reading.summary}</p>
            <div className="row">
              <button className="btn filled" onClick={() => { changeView("reading"); triggerGenerate(); }}>
                <span className="ms" aria-hidden="true">auto_awesome</span>New reading
              </button>
              <button className="btn outlined" onClick={() => changeView("profile")}>Edit profile</button>
            </div>
          </div>

          <div className="grid three" style={{ marginTop: "12px" }}>
            <div className="card topic">
              <div className="head"><span className="ms" aria-hidden="true">work</span><h3>Career</h3></div>
              <p>{aiReading ? aiReading.career : reading.career}</p>
            </div>
            <div className="card topic">
              <div className="head"><span className="ms" aria-hidden="true">favorite</span><h3>Relationships</h3></div>
              <p>{aiReading ? aiReading.relationships : reading.rel}</p>
            </div>
            <div className="card topic">
              <div className="head"><span className="ms" aria-hidden="true">self_improvement</span><h3>Personal growth</h3></div>
              <p>{aiReading ? aiReading.personalGrowth : reading.growth}</p>
            </div>
          </div>
        </section>

        {/* PROFILE VIEW */}
        <section className={`view ${view === "profile" ? "active" : ""}`} id="view-profile">
          <div className="card">
            <h2>Your details</h2>
            <p className="muted">Saved in this browser only. Nothing is sent anywhere without your permission.</p>

            {/* Guided Intake Banner */}
            <div style={{ margin: "16px 0", padding: "16px", borderRadius: "18px", background: "linear-gradient(160deg, rgba(65, 88, 138, 0.45) 0%, rgba(35, 50, 95, 0.65) 100%)", border: "1px solid rgba(255, 255, 255, 0.16)", backdropFilter: "blur(20px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ color: "var(--primary)", fontWeight: "600", fontSize: "14px" }}>
                    {intake.name ? `Guided Intake Completed (${intake.name})` : "Personalize Orbit with AI Guide"}
                  </div>
                  <div style={{ color: "var(--on-var)", fontSize: "12px", marginTop: "2px" }}>
                    {intake.goal ? `Focus: ${intake.focus.join(', ') || 'General'} · Goal: ${clip(intake.goal, 35)}` : "10 quick questions with suggestion chips"}
                  </div>
                </div>
                <button className="btn filled" style={{ height: "36px", fontSize: "13px" }} onClick={startIntake}>
                  <span className="ms" aria-hidden="true">forum</span>
                  {intake.name ? "Retake guided intake" : "Start intake chat"}
                </button>
              </div>
            </div>

            {/* Profile Custom Calendar Widget (Matching Reference Design: 3 Tabs, Big Typography, Curved Arc) */}
            <div className="profile-calendar-widget" role="region" aria-label="Birth date selector">
              {/* Hidden input to maintain DOM compatibility */}
              <input type="hidden" id="birth" name="birth" value={profile.birth || ""} />

              {/* Top Segmented Tabs: 3 Tabs (Day, Month, Year) */}
              <div className="cal-tabs-bar">
                <div className="cal-tabs-track" role="tablist" aria-label="Date selector tabs">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={calendarTab === "day"}
                    className={`cal-tab-btn ${calendarTab === "day" ? "active" : ""}`}
                    onClick={() => setCalendarTab("day")}
                  >
                    Day
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={calendarTab === "month"}
                    className={`cal-tab-btn ${calendarTab === "month" ? "active" : ""}`}
                    onClick={() => setCalendarTab("month")}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={calendarTab === "year"}
                    className={`cal-tab-btn ${calendarTab === "year" ? "active" : ""}`}
                    onClick={() => setCalendarTab("year")}
                  >
                    Year
                  </button>
                </div>
              </div>

              {/* Big Typography Display: Month on Left, Day on Right (Exact reference match!) */}
              <div className="cal-big-header">
                <div className="cal-big-month-col">
                  <span className="cal-big-month">
                    {MONTH_NAMES[currentBirthParts.month - 1]}
                  </span>
                  <span className="cal-big-sub">
                    {currentBirthParts.year} · {detectedSignInfo.n} {detectedSignInfo.s}&#xFE0E;
                  </span>
                </div>
                <div className="cal-big-day">
                  {currentBirthParts.day}
                </div>
              </div>

              {/* Reel Stage (Upright circular flow for Day/Month, Straight line with Pills for Year) */}
              <div
                className="cal-arc-stage"
                role="region"
                aria-label={`Select ${calendarTab}`}
                onTouchStart={handleCalTouchStart}
                onTouchMove={handleCalTouchMove}
                onTouchEnd={handleCalTouchEnd}
                onMouseDown={handleCalMouseDown}
                onMouseMove={handleCalMouseMove}
                onMouseUp={handleCalMouseUp}
                onMouseLeave={handleCalMouseUp}
              >
                {/* Straight subtle baseline for Year only; Curved line removed as requested */}
                {calendarTab === "year" && (
                  <div className="cal-straight-line" aria-hidden="true" />
                )}

                {/* Items */}
                {getArchItems().map((item) => {
                  if (item.hidden) return null;
                  const k = item.k;

                  if (item.isEmpty) {
                    const R = 190;
                    const angleStep = 0.244;
                    const angle = k * angleStep + (isCalDragging ? (calDragOffset / 50) * angleStep * 0.6 : 0);
                    const x = Math.round(R * Math.sin(angle));
                    const y = Math.round(R * (1 - Math.cos(angle)));
                    const scale = 0.8;
                    const opacity = Math.max(0.18, 1 - Math.abs(k) * 0.26);

                    return (
                      <div
                        key={`empty-${k}`}
                        className="cal-arc-item cal-arc-empty-slot"
                        style={{
                          transform: `translate(calc(-50% + ${x}px), ${y}px) scale(${scale})`,
                          opacity: opacity,
                          zIndex: 5,
                          transition: isCalDragging
                            ? "none"
                            : "transform 0.52s cubic-bezier(0.34, 1.45, 0.64, 1), opacity 0.35s ease"
                        }}
                        aria-hidden="true"
                      >
                        <div className="cal-empty-dot" />
                      </div>
                    );
                  }

                  if (item.isYear) {
                    // Straight horizontal rail layout with pills (No circle!)
                    const x = k * 74 + (isCalDragging ? calDragOffset * 0.5 : 0);
                    const scale = k === 0 ? 1 : 0.88;
                    const opacity = k === 0 ? 1 : Math.max(0.28, 1 - Math.abs(k) * 0.35);
                    const zIndex = 10 - Math.abs(k);

                    return (
                      <button
                        key={`${calendarTab}-${item.val}`}
                        type="button"
                        className={`cal-year-pill-item ${item.isSelected ? "selected" : ""}`}
                        style={{
                          transform: `translate(calc(-50% + ${x}px), 0px) scale(${scale})`,
                          opacity: opacity,
                          zIndex: zIndex,
                          transition: isCalDragging
                            ? "none"
                            : "transform 0.32s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease"
                        }}
                        onClick={() => {
                          if (Math.abs(calDragRef.current.currentX - calDragRef.current.startX) < 6) {
                            if (k !== 0) stepCalItem(k);
                          }
                        }}
                        aria-label={`Select year ${item.bottom}`}
                      >
                        {item.bottom}
                      </button>
                    );
                  }

                  // Day & Month: Exact upright angle (no slanting) along circular path
                  const R = 190;
                  const angleStep = 0.244; // ~14 deg
                  const angle = k * angleStep + (isCalDragging ? (calDragOffset / 50) * angleStep * 0.6 : 0);
                  const x = Math.round(R * Math.sin(angle));
                  const y = Math.round(R * (1 - Math.cos(angle)));
                  const scale = k === 0 ? 1 : Math.max(0.72, 1 - Math.abs(k) * 0.08);
                  const opacity = k === 0 ? 1 : Math.max(0.18, 1 - Math.abs(k) * 0.26);
                  const zIndex = 10 - Math.abs(k);

                  return (
                    <button
                      key={`${calendarTab}-${item.val}`}
                      type="button"
                      className={`cal-arc-item ${item.isSelected ? "selected" : ""}`}
                      style={{
                        transform: `translate(calc(-50% + ${x}px), ${y}px) scale(${scale})`,
                        opacity: opacity,
                        zIndex: zIndex,
                        transition: isCalDragging
                          ? "none"
                          : "transform 0.52s cubic-bezier(0.34, 1.45, 0.64, 1), opacity 0.35s ease"
                      }}
                      onClick={() => {
                        if (Math.abs(calDragRef.current.currentX - calDragRef.current.startX) < 6) {
                          if (item.slot) {
                            if (calendarTab === "day") {
                              updateBirthDate(item.slot.year, item.slot.month, item.slot.day);
                            } else if (calendarTab === "month") {
                              updateBirthDate(currentBirthParts.year, item.slot.month, currentBirthParts.day);
                            }
                          } else if (k !== 0) {
                            stepCalItem(k);
                          }
                        }
                      }}
                      aria-label={`Select ${calendarTab} ${item.bottom}`}
                    >
                      <span className="cal-arc-top">{item.top}</span>
                      <div className="cal-arc-circle">
                        <span>{item.bottom}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Bar: Matching Reference note info & action button */}
              <div className="cal-footer-bar">
                <div className="cal-footer-note">
                  <span className="ms" aria-hidden="true">auto_awesome</span>
                  <span>
                    {detectedSignInfo.n} · {MONTH_NAMES[currentBirthParts.month - 1]} {currentBirthParts.day}, {currentBirthParts.year}
                  </span>
                </div>
                <button
                  type="button"
                  className="cal-footer-btn"
                  onClick={handleJumpToToday}
                >
                  <span className="ms" aria-hidden="true">today</span>
                  Today
                </button>
              </div>
            </div>

            {/* 3D Zodiac Sign Card Deck Carousel */}
            <div className="sign-carousel-section">
              <div className="sign-carousel-header">
                <label className="label" style={{ fontSize: "13px" }}>Choose your sign</label>
                <span className="muted" style={{ fontSize: "12px" }}>Swipe left or right</span>
              </div>

              <div
                className="sign-deck-wrapper"
                ref={wrapperRef}
                tabIndex={0}
                role="region"
                aria-label="Zodiac sign carousel"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") { stepDeck(-1); e.preventDefault(); }
                  else if (e.key === "ArrowRight") { stepDeck(1); e.preventDefault(); }
                }}
              >
                <div className={`sign-deck ${isDragging ? "dragging" : ""}`}>
                  {SIGNS.map((s, idx) => {
                    const total = SIGNS.length;
                    let diff = idx - deckIndex;
                    while (diff > total / 2) diff -= total;
                    while (diff < -total / 2) diff += total;

                    let transform = "";
                    let opacity = "0";
                    let zIndex = "1";
                    let isAct = diff === 0;
                    let isAdj = Math.abs(diff) === 1;

                    if (diff === 0) {
                      const x = dragOffset * 0.88;
                      const rot = dragOffset * 0.04;
                      const sc = 1 - Math.abs(dragOffset) * 0.0006;
                      transform = `translate3d(${x}px, 0, 0) scale(${sc}) rotate(${rot}deg)`;
                      opacity = "1";
                      zIndex = "10";
                    } else if (diff === 1) {
                      const x = 92 + dragOffset * 0.7;
                      const rot = -12 + dragOffset * 0.04;
                      const sc = 0.86 + (dragOffset < 0 ? Math.abs(dragOffset) * 0.0009 : 0);
                      transform = `translate3d(${x}px, 0, -45px) scale(${sc}) rotateY(${rot}deg)`;
                      opacity = `${Math.min(1, 0.75 + (dragOffset < 0 ? Math.abs(dragOffset) * 0.002 : 0))}`;
                      zIndex = "8";
                    } else if (diff === -1) {
                      const x = -92 + dragOffset * 0.7;
                      const rot = 12 + dragOffset * 0.04;
                      const sc = 0.86 + (dragOffset > 0 ? Math.abs(dragOffset) * 0.0009 : 0);
                      transform = `translate3d(${x}px, 0, -45px) scale(${sc}) rotateY(${rot}deg)`;
                      opacity = `${Math.min(1, 0.75 + (dragOffset > 0 ? Math.abs(dragOffset) * 0.002 : 0))}`;
                      zIndex = "8";
                    } else if (Math.abs(diff) === 2) {
                      const x2 = diff * 138 + dragOffset * 0.45;
                      const rot2 = diff * -20;
                      transform = `translate3d(${x2}px, 0, -95px) scale(0.72) rotateY(${rot2}deg)`;
                      opacity = "0.35";
                      zIndex = "6";
                    } else {
                      const x3 = diff * 160;
                      transform = `translate3d(${x3}px, 0, -150px) scale(0.6)`;
                      opacity = "0";
                      zIndex = "1";
                    }

                    return (
                      <div
                        key={s.n}
                        className={`deck-card ${isAct ? "active" : ""} ${isAdj ? "adjacent" : ""}`}
                        style={{ transform, opacity, zIndex }}
                      >
                        <div className="deck-card-avatar">
                          <img
                            src={`/assets/signs/${s.n.toLowerCase()}.png`}
                            alt={s.n}
                            className="deck-card-img"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextElementSibling) {
                                e.currentTarget.nextElementSibling.style.display = 'grid';
                              }
                            }}
                          />
                          <div className="deck-card-fallback-symbol">{s.s}&#xFE0E;</div>
                        </div>
                        <div className="deck-card-name">{s.n}</div>
                        <div className="deck-card-dates">{s.d}</div>
                        <div className="deck-card-meta">{s.e} · {s.p}</div>
                        <div className="deck-card-pill">{isAct ? "Selected" : "Choose"}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="deck-dots">
                {SIGNS.map((s, idx) => (
                  <div
                    key={s.n}
                    className={`deck-dot ${idx === deckIndex ? "active" : ""}`}
                    role="button"
                    aria-label={`Go to ${s.n}`}
                    onClick={() => selectSignCard(idx)}
                  />
                ))}
              </div>
              {signHint && (
                <div className="support" style={{ textAlign: "center", margin: "8px 0 0" }}>
                  {signHint}
                </div>
              )}
            </div>

            <div className="field">
              <textarea
                id="goals"
                maxLength={300}
                placeholder=" "
                value={profile.goals || intake.goal || ""}
                onChange={(e) => setProfile({ ...profile, goals: e.target.value })}
              />
              <label htmlFor="goals">Current goals</label>
            </div>
            <div className="support">For example: land a first client, save money, pass exams</div>

            <div className="field">
              <textarea
                id="situation"
                maxLength={300}
                placeholder=" "
                value={profile.situation || intake.situation || ""}
                onChange={(e) => setProfile({ ...profile, situation: e.target.value })}
              />
              <label htmlFor="situation">Personal situation</label>
            </div>
            <div className="support">For example: balancing university and freelance work</div>

            <div className="row">
              <button className="btn filled" onClick={() => saveProfileHandler(false)}>Save</button>
              <button className="btn tonal" onClick={() => saveProfileHandler(true)}>Save and generate reading</button>
            </div>

            {/* Privacy note and Delete Data section */}
            <div className="privacy-banner">
              <span className="ms fill" style={{ fontSize: "16px", verticalAlign: "text-bottom", marginRight: "6px" }} aria-hidden="true">lock</span>
              Your data is saved strictly on this device in your browser. When AI guidance is enabled, questions and answers are processed securely by Gemini for reflection and entertainment only.
            </div>

            <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
              <button className="btn danger" onClick={handleDeleteAllData}>
                <span className="ms" aria-hidden="true">delete_forever</span>
                Delete all my data
              </button>
            </div>
          </div>
        </section>

        {/* READING VIEW (matching reference screenshot with Today/Tomorrow/Month tabs, squircles & plain English description) */}
        <section className={`view ${view === "reading" ? "active" : ""}`} id="view-reading">
          <div className="reading-container">
            {/* Top Timeframe Tabs: Today | Tomorrow | Month */}
            <div className="timeframe-tabs">
              {[
                { id: "today", label: "Today" },
                { id: "tomorrow", label: "Tomorrow" },
                { id: "month", label: "Month" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`timeframe-tab ${timeframe === tab.id ? "active" : ""}`}
                  onClick={() => setTimeframe(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Category Squircles Row */}
            <div className="category-squircle-row">
              {READING_TOPICS.map((topic) => {
                const isActive = readingTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    className={`category-squircle ${isActive ? "active" : ""}`}
                    onClick={() => setReadingTopic(topic.id)}
                    title={topic.title}
                    aria-label={topic.title}
                  >
                    {topic.id === "love" ? (
                      <TwinHeartsIcon />
                    ) : (
                      <span className="ms fill">{topic.icon}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Topic Header: Title on Left, Stars on Right */}
            <div className="reading-topic-header">
              <div className="reading-topic-title">{currentReading.title}</div>
              <div className="reading-stars">
                {renderStars(currentReading.rating)}
              </div>
            </div>

            {/* Detailed Description in Plain English */}
            <div className="reading-description-box">
              {isGenerating ? (
                <div className="loading" style={{ padding: "24px 0", color: "#c5cefa" }}>
                  <div className="spinner"></div>
                  Reflecting across the cosmos…
                </div>
              ) : (
                <p className="reading-description-text">{currentReading.description}</p>
              )}
            </div>

            {/* Reading Action Bar */}
            <div className="reading-action-bar">
              <button className="btn filled" onClick={() => triggerGenerate(true)} disabled={isGenerating}>
                <span className="ms" aria-hidden="true">auto_awesome</span>
                <span>{isGenerating ? "Reflecting…" : "Generate fresh reading"}</span>
              </button>
              <span className="reading-badge">
                {currentReading.isAi ? "✨ Gemini AI" : "🔮 Orbit Wisdom"}
              </span>
            </div>

            {/* Context Chips */}
            <div className="chips" style={{ marginTop: "18px" }}>
              <span className="chip">{reading.sign.s}&#xFE0E; {reading.sign.n}</span>
              {intake.name && <span className="chip">{intake.name}</span>}
              {intake.tone && <span className="chip">Tone: {intake.tone}</span>}
              {reading.used.goal && <span className="chip">Your goals</span>}
              {reading.used.challenge && <span className="chip">Challenge: {clip(intake.challenge, 20)}</span>}
              {reading.used.notes > 0 && (
                <span className="chip">
                  {reading.used.notes} saved note{reading.used.notes > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* NOTES / MEMORY VIEW */}
        <section className={`view ${view === "memory" ? "active" : ""}`} id="view-memory">
          <div className="card">
            <h2>Notes</h2>
            <p className="muted">Short notes about your goals or situation. They can appear in your readings.</p>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div className="field">
                  <input
                    type="text"
                    id="noteInput"
                    maxLength={140}
                    placeholder=" "
                    autoComplete="off"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddNote(); }}
                  />
                  <label htmlFor="noteInput">Add a note</label>
                </div>
              </div>
              <button className="btn filled" onClick={handleAddNote} style={{ marginTop: "24px", height: "56px" }}>
                <span className="ms" aria-hidden="true">add</span>Add
              </button>
            </div>
            <div className="support">
              {notes.length ? `${notes.length} saved note${notes.length > 1 ? "s" : ""}` : ""}
            </div>
            <ul className="list">
              {!notes.length ? (
                <li style={{ display: "block", border: 0 }}>
                  <div className="empty">
                    <span className="ms" aria-hidden="true">sticky_note_2</span>
                    <div>No notes yet. Add a goal or a short thought above.</div>
                  </div>
                </li>
              ) : (
                notes.map((n) => (
                  <li key={n.id}>
                    <span className="tx">{n.text}</span>
                    <button
                      className="iconbtn"
                      aria-label="Delete note"
                      onClick={() => handleDeleteNote(n.id)}
                    >
                      <span className="ms" aria-hidden="true">delete</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        {/* ACTION VIEW */}
        <section className={`view ${view === "action" ? "active" : ""}`} id="view-action">
          <div className={`card action ${state.actionDone ? "done" : ""}`}>
            <div className="label">Today's action</div>
            <div className="big">{action.text}</div>
            <div className="muted">
              {action.personal
                ? (checkin.mainTask ? "From your Daily Check-in priority." : `Chosen because of your focus on ${CAT[action.cat]}.`)
                : "Add goals in Profile or Daily Check-in for personal action prompts."}
            </div>
            {state.actionDone && (
              <div className="done-tag">
                <span className="ms fill" aria-hidden="true">check_circle</span>Completed
              </div>
            )}
            <div className="row">
              <button className="btn filled" onClick={toggleActionDone}>
                {state.actionDone ? "Undo" : "Mark as done"}
              </button>
              <button className="btn outlined" onClick={handleNextAction}>
                <span className="ms" aria-hidden="true">refresh</span>Show another
              </button>
            </div>
          </div>
        </section>

        <p className="foot">
          Orbit uses simple reflections and Gemini AI prompts, not real astrology or predictions. For reflection and entertainment only.
        </p>
      </main>

      <div id="snack" className={toast.show ? "show" : ""} role="status">
        {toast.text}
      </div>
    </>
  );
}
