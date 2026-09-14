export const dashboardMetrics = {
  performanceScore: {
    label: 'Performance Score',
    value: '88%',
    change: '+4%',
    isPositive: true,
    caption: 'Prototype consistency benchmark',
  },
  sessionConsistency: {
    label: 'Session Consistency',
    value: '84%',
    status: 'High',
    isPositive: true,
    caption: 'Signal energy stability index',
  },
  practiceTime: {
    label: 'Practice Time',
    value: '6.4 hrs',
    status: 'This Week',
    caption: 'Goal: 7.0 hrs / week (91% reached)',
  },
  practiceStreak: {
    label: 'Practice Streak',
    value: '5 days',
    status: 'Active',
    caption: 'Personal best: 12 consecutive days',
  },
};

export const practiceOverview = {
  totalSessions: 8,
  totalPracticeTime: '6.4 hrs',
  goalPercentage: 91,
  currentStreakDays: 5,
  weeklyGoalHours: 7.0,
  dailyLog: [
    { dayKey: 'M', dayName: 'Mon', minutes: 45, completed: true },
    { dayKey: 'T', dayName: 'Tue', minutes: 60, completed: true },
    { dayKey: 'W', dayName: 'Wed', minutes: 35, completed: true },
    { dayKey: 'T', dayName: 'Thu', minutes: 50, completed: true },
    { dayKey: 'F', dayName: 'Fri', minutes: 40, completed: true },
    { dayKey: 'S', dayName: 'Sat', minutes: 0, completed: false },
    { dayKey: 'S', dayName: 'Sun', minutes: 0, completed: false },
  ],
};

export const recentSessions = [
  {
    id: 'sess-042',
    title: 'Morning Riaz — Sustained Notes Drill',
    date: 'Today, 7:30 AM',
    duration: '35m',
    durationMinutes: 35,
    instrument: 'Vocal / Sitar',
    focus: 'Volume steadiness & breath control',
    score: 88,
    accuracy: 90,
    stability: 86,
    consistency: 88,
    consistencyLabel: 'High',
    status: 'Completed',
    source: 'demo',
    createdAt: '2026-09-13T07:30:00.000Z',
    feedback:
      'Demonstration feedback — steady acoustic energy observed across the take with balanced dynamic range during sustained note passages.',
    nextStep:
      'Continue focusing on breath control during sustained passages in your next riaz session.',
  },
  {
    id: 'sess-041',
    title: 'Raga Yaman — Mandra Saptak Alap',
    date: 'Yesterday, 6:15 PM',
    duration: '45m',
    durationMinutes: 45,
    instrument: 'Sitar',
    focus: 'Lower octave resonance & sustain',
    score: 85,
    accuracy: 87,
    stability: 83,
    consistency: 85,
    consistencyLabel: 'Steady',
    status: 'Completed',
    source: 'demo',
    createdAt: '2026-09-12T18:15:00.000Z',
    feedback:
      'Demonstration feedback — resonance and sustain qualities were consistent across the lower register passages in this illustrative take.',
    nextStep:
      'Explore extended alap phrases in the mandra saptak to build lower octave confidence.',
  },
  {
    id: 'sess-040',
    title: 'Meend & Slide Transition Practice',
    date: 'Sep 11, 2026',
    duration: '28m',
    durationMinutes: 28,
    instrument: 'Sarod',
    focus: 'Even dynamic glide control',
    score: 82,
    accuracy: 84,
    stability: 80,
    consistency: 82,
    consistencyLabel: 'Moderate',
    status: 'Completed',
    source: 'demo',
    createdAt: '2026-09-11T10:00:00.000Z',
    feedback:
      'Demonstration feedback — glide transitions show moderate consistency with room for smoother dynamic control across meend passages.',
    nextStep:
      'Practice slow meend transitions focusing on even pressure and speed control.',
  },
  {
    id: 'sess-039',
    title: 'Fast Taans & Articulation Drills',
    date: 'Sep 10, 2026',
    duration: '40m',
    durationMinutes: 40,
    instrument: 'Vocal',
    focus: 'Tempo steadiness & clean onset',
    score: 79,
    accuracy: 81,
    stability: 77,
    consistency: 79,
    consistencyLabel: 'Moderate',
    status: 'Completed',
    source: 'demo',
    createdAt: '2026-09-10T09:00:00.000Z',
    feedback:
      'Demonstration feedback — articulation clarity was moderate with some variation in onset timing during faster taan passages.',
    nextStep:
      'Reduce tempo by 20% and focus on clean note onsets before gradually increasing speed.',
  },
];

export const progressData = [
  { session: 'S-037', score: 76, label: 'Sep 7' },
  { session: 'S-038', score: 80, label: 'Sep 8' },
  { session: 'S-039', score: 79, label: 'Sep 10' },
  { session: 'S-040', score: 82, label: 'Sep 11' },
  { session: 'S-041', score: 85, label: 'Sep 12' },
  { session: 'S-042', score: 88, label: 'Today' },
];

export const focusArea = {
  title: 'Upper-register transition consistency',
  badge: 'Illustrative recommendation',
  subtitle: 'Demonstration insight',
  description:
    'Focus on maintaining even breath pressure and steady stroke force during upper register octave intervals in your next practice session.',
  tag: 'Tone Steadiness',
  suggestedExercise:
    '5 minutes of slow sustained notes on the fundamental pitch before attempting rapid register shifts.',
};

export const demoAnalysisResult = {
  overallScore: 86,
  accuracy: 88,
  stability: 84,
  consistency: 87,
  durationFormatted: '3m 42s',
  signalEnergy: 'Steady acoustic energy',
  dynamicRange: 'Balanced (-18 dB to -6 dB)',
  feedbackSummary:
    'The recorded take demonstrates steady acoustic energy with consistent sustain through the primary register. Subtle volume fluctuations were identified during phrase transitions.',
  suggestedNextStep:
    'Incorporate 5 minutes of sustained long notes before moving into higher tempo exercises in your next riaz session.',
  focusPoints: [
    'Maintain steady acoustic energy when holding extended notes',
    'Smooth out volume spikes during interval transitions',
    'Continue tracking session consistency across consecutive days',
  ],
};
