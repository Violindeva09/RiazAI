import { recentSessions, demoAnalysisResult } from '../data/demoData';

const SESSIONS_KEY = 'riazai_sessions';
const LAST_ANALYSIS_KEY = 'riazai_last_analysis';

// In-memory fallback if localStorage is disabled/unavailable
let memorySessions = null;
let memoryAnalysis = null;

/**
 * Parse a duration string like '35m', '1h 20m', '3m 42s' into minutes.
 * Returns 0 if unparseable.
 */
export function parseDurationToMinutes(durationStr) {
  if (!durationStr) return 0;
  if (typeof durationStr === 'number') return durationStr;
  const str = String(durationStr).toLowerCase().trim();
  let totalMinutes = 0;
  const hourMatch = str.match(/(\d+)\s*h/);
  const minMatch = str.match(/(\d+)\s*m/);
  const secMatch = str.match(/(\d+)\s*s/);
  if (hourMatch) totalMinutes += parseInt(hourMatch[1], 10) * 60;
  if (minMatch) totalMinutes += parseInt(minMatch[1], 10);
  if (secMatch) totalMinutes += Math.ceil(parseInt(secMatch[1], 10) / 60);
  return totalMinutes || 0;
}

/**
 * Normalize a session to ensure it has all canonical fields.
 * Gracefully fills missing data with safe defaults.
 * Handles both legacy demo sessions and new F0 analysis sessions.
 */
function normalizeSession(session) {
  if (!session || typeof session !== 'object') return null;

  const isF0Session = session.source === 'user' && session.analysisVersion?.startsWith('f0-');

  return {
    id: session.id || `sess-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: session.title || 'Practice Session',
    date: session.date || 'Unknown date',
    duration: session.duration || '0m',
    durationMinutes: session.durationMinutes || parseDurationToMinutes(session.duration),
    instrument: session.instrument || 'Instrument',
    focus: session.focus || 'General practice',
    score: typeof session.score === 'number' ? session.score : 0,
    accuracy: typeof session.accuracy === 'number' ? session.accuracy : session.score || 0,
    stability: typeof session.stability === 'number' ? session.stability : session.score || 0,
    consistency: typeof session.consistency === 'number' ? session.consistency : session.score || 0,
    consistencyLabel: session.consistencyLabel || session.consistency || 'Steady',
    status: session.status || 'Completed',
    source: session.source || 'demo',
    createdAt: session.createdAt || new Date().toISOString(),
    feedback: session.feedback || '',
    nextStep: session.nextStep || '',

    // F0-specific fields (backward compatible — absent in demo sessions)
    analysisVersion: session.analysisVersion || null,
    pitchAvailable: session.pitchAvailable ?? null,
    medianHz: session.medianHz ?? null,
    rangeHz: session.rangeHz ?? null,
    pitchStability: session.pitchStability ?? null,
    voicingRatio: session.voicingRatio ?? null,
    frameCount: session.frameCount ?? null,
    sampleRate: session.sampleRate ?? null,
    processingTimeMs: session.processingTimeMs ?? null,
  };
}

/**
 * Retrieve stored sessions from localStorage.
 * Returns demo sessions on first load (null key).
 * Returns empty array if user has explicitly cleared sessions (empty array stored).
 */
export function getStoredSessions() {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeSession).filter(Boolean);
      }
    }
  } catch (err) {
    if (memorySessions) return memorySessions;
  }
  // First load — no key exists yet, use demo sessions
  return recentSessions.map(normalizeSession).filter(Boolean);
}

/**
 * Save a new session to the head of the sessions list.
 * Generates unique ID, defaults source to 'user', persists to storage.
 */
export function saveSession(newSession) {
  const current = getStoredSessions();
  const sessionEntry = normalizeSession({
    id: `sess-${Date.now()}`,
    source: 'user',
    createdAt: new Date().toISOString(),
    date: 'Just now',
    status: 'Completed',
    ...newSession,
  });

  // Prevent duplicate IDs
  const filtered = current.filter((s) => s.id !== sessionEntry.id);
  const updated = [sessionEntry, ...filtered];

  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  } catch (err) {
    memorySessions = updated;
  }
  return updated;
}

/**
 * Delete a session by ID. Returns updated list.
 */
export function deleteSession(sessionId) {
  const current = getStoredSessions();
  const updated = current.filter((s) => s.id !== sessionId);
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  } catch (err) {
    memorySessions = updated;
  }
  return updated;
}

/**
 * Reset sessions to the default demo data set.
 */
export function resetToDemoSessions() {
  const demo = recentSessions.map(normalizeSession).filter(Boolean);
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(demo));
  } catch (err) {
    memorySessions = demo;
  }
  return demo;
}

/**
 * Find a single session by its ID.
 */
export function getStoredSessionById(id) {
  const sessions = getStoredSessions();
  return sessions.find((s) => s.id === id) || null;
}

export function getStoredAnalysis() {
  try {
    const raw = localStorage.getItem(LAST_ANALYSIS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    if (memoryAnalysis) return memoryAnalysis;
  }
  return demoAnalysisResult;
}

export function saveAnalysisResult(result) {
  try {
    localStorage.setItem(LAST_ANALYSIS_KEY, JSON.stringify(result));
  } catch (err) {
    memoryAnalysis = result;
  }
  return result;
}

/**
 * Get sessions that have real F0 analysis data.
 */
export function getRealAnalysisSessions() {
  const sessions = getStoredSessions();
  return sessions.filter((s) => s.source === 'user' && s.analysisVersion?.startsWith('f0-'));
}

/**
 * Check if there are enough real F0 sessions for trend analysis.
 */
export function hasEnoughF0Sessions() {
  return getRealAnalysisSessions().length >= 2;
}
