/**
 * Analytics calculation utilities.
 * All values are derived directly from the session dataset —
 * no arbitrary analytics values are manufactured.
 */

/**
 * Calculate overview summary from a sessions array.
 */
export function calculateOverview(sessions) {
  if (!sessions || sessions.length === 0) {
    return {
      totalSessions: 0,
      totalMinutes: 0,
      totalTimeFormatted: '0 min',
      averageScore: 0,
      averageConsistency: 0,
    };
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const averageScore = Math.round(
    sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length
  );
  const averageConsistency = Math.round(
    sessions.reduce((sum, s) => sum + (s.consistency || 0), 0) / sessions.length
  );

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const totalTimeFormatted = hours > 0 ? `${hours}h ${mins}m` : `${totalMinutes} min`;

  return {
    totalSessions: sessions.length,
    totalMinutes,
    totalTimeFormatted,
    averageScore,
    averageConsistency,
  };
}

/**
 * Calculate average breakdown of accuracy, stability, consistency.
 */
export function calculatePerformanceBreakdown(sessions) {
  if (!sessions || sessions.length === 0) {
    return { accuracy: 0, stability: 0, consistency: 0 };
  }

  return {
    accuracy: Math.round(
      sessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / sessions.length
    ),
    stability: Math.round(
      sessions.reduce((sum, s) => sum + (s.stability || 0), 0) / sessions.length
    ),
    consistency: Math.round(
      sessions.reduce((sum, s) => sum + (s.consistency || 0), 0) / sessions.length
    ),
  };
}

/**
 * Calculate session highlights based on stored data.
 * Score delta describes the change across saved sessions — not a claim of genuine improvement.
 */
export function calculateHighlights(sessions) {
  if (!sessions || sessions.length === 0) {
    return { strongest: null, longest: null, scoreDelta: null };
  }

  const sorted = [...sessions].sort((a, b) => (b.score || 0) - (a.score || 0));
  const strongest = sorted[0];

  const longestSorted = [...sessions].sort(
    (a, b) => (b.durationMinutes || 0) - (a.durationMinutes || 0)
  );
  const longest = longestSorted[0];

  // Score delta: compare most recent vs earliest session
  let scoreDelta = null;
  if (sessions.length >= 2) {
    const chronological = [...sessions].sort(
      (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    );
    const earliest = chronological[0];
    const latest = chronological[chronological.length - 1];
    scoreDelta = (latest.score || 0) - (earliest.score || 0);
  }

  return { strongest, longest, scoreDelta };
}

/**
 * Build chronological trend data points for SVG charting.
 */
export function calculateProgressTrend(sessions) {
  if (!sessions || sessions.length === 0) return [];

  return [...sessions]
    .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
    .map((s, idx) => ({
      index: idx + 1,
      label: s.date || `Session ${idx + 1}`,
      score: s.score || 0,
      consistency: s.consistency || 0,
      title: s.title || '',
    }));
}

/**
 * Build practice frequency data — minutes per session in chronological order.
 */
export function calculatePracticeFrequency(sessions) {
  if (!sessions || sessions.length === 0) return [];

  return [...sessions]
    .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
    .map((s, idx) => ({
      index: idx + 1,
      label: s.date || `Session ${idx + 1}`,
      minutes: s.durationMinutes || 0,
      title: s.title || '',
    }));
}

/**
 * Extract unique instruments from sessions for filter dropdown.
 */
export function getUniqueInstruments(sessions) {
  if (!sessions || sessions.length === 0) return [];
  const instruments = new Set(sessions.map((s) => s.instrument).filter(Boolean));
  return Array.from(instruments).sort();
}

/**
 * Extract unique focus tags from sessions.
 */
export function getFocusTags(sessions) {
  if (!sessions || sessions.length === 0) return [];
  const tags = new Set(sessions.map((s) => s.focus).filter(Boolean));
  return Array.from(tags);
}
