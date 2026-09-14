import { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import ProgressChart from '../components/analytics/ProgressChart';
import PracticeFrequencyChart from '../components/analytics/PracticeFrequencyChart';
import MetricTrend from '../components/analytics/MetricTrend';
import { NavIcon } from '../components/navigation/NavIcons';
import { getStoredSessions } from '../utils/storage';
import {
  calculateOverview,
  calculatePerformanceBreakdown,
  calculateHighlights,
  calculateProgressTrend,
  calculatePracticeFrequency,
  getFocusTags,
} from '../utils/analyticsCalculations';

export default function Analytics() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    setSessions(getStoredSessions());
  }, []);

  // All analytics values are derived from the stored session dataset
  const overview = useMemo(() => calculateOverview(sessions), [sessions]);
  const breakdown = useMemo(() => calculatePerformanceBreakdown(sessions), [sessions]);
  const highlights = useMemo(() => calculateHighlights(sessions), [sessions]);
  const trendData = useMemo(() => calculateProgressTrend(sessions), [sessions]);
  const frequencyData = useMemo(() => calculatePracticeFrequency(sessions), [sessions]);
  const focusTags = useMemo(() => getFocusTags(sessions), [sessions]);

  // F0-specific analytics
  const f0Sessions = useMemo(
    () => sessions.filter((s) => s.source === 'user' && s.analysisVersion?.startsWith('f0-')),
    [sessions]
  );

  const hasEnoughF0Data = f0Sessions.length >= 2;

  // Compute F0-specific averages when we have enough data
  const f0Averages = useMemo(() => {
    if (!hasEnoughF0Data) return null;
    const withPitch = f0Sessions.filter((s) => s.pitchAvailable && s.medianHz > 0);
    if (withPitch.length === 0) return null;

    return {
      count: withPitch.length,
      avgMedianHz: withPitch.reduce((sum, s) => sum + (s.medianHz || 0), 0) / withPitch.length,
      avgStability: withPitch.reduce((sum, s) => sum + (s.pitchStability || 0), 0) / withPitch.length,
      avgVoicingRatio: withPitch.reduce((sum, s) => sum + (s.voicingRatio || 0), 0) / withPitch.length,
    };
  }, [f0Sessions, hasEnoughF0Data]);

  // Empty state: no sessions at all
  if (sessions.length === 0) {
    return (
      <div className="space-y-8">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Progress Analytics
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track your practice trajectory and performance patterns over time.
          </p>
        </div>

        <Card className="py-8">
          <EmptyState
            icon={(props) => <NavIcon name="analytics" {...props} />}
            title="No analytics data yet"
            description="Complete practice sessions to unlock analytics. Your progress, trends, and patterns will appear here as you build practice history."
            action={
              <NavLink
                to="/analyse"
                className="btn-primary inline-flex items-center gap-2"
              >
                <NavIcon name="analyse" className="w-4 h-4" />
                Analyse Your First Session
              </NavLink>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Progress Analytics
            </h1>
            <Badge variant="primary" className="text-xs font-semibold">
              {overview.totalSessions} session{overview.totalSessions !== 1 ? 's' : ''}
            </Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            All values derived from your {overview.totalSessions} stored practice session
            {overview.totalSessions !== 1 ? 's' : ''}.
            {f0Sessions.length > 0 && (
              <span className="ml-1 text-emerald-600 font-medium">
                ({f0Sessions.length} F0 analysis{f0Sessions.length !== 1 ? 'es' : ''})
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <NavLink
            to="/sessions"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
          >
            View Sessions
          </NavLink>
          <NavLink
            to="/analyse"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-xs transition-colors flex items-center gap-2"
          >
            <NavIcon name="analyse" className="w-4 h-4" />
            <span>New Analysis</span>
          </NavLink>
        </div>
      </div>

      {/* A. Overview Metrics */}
      <section aria-label="Analytics Overview" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Total Sessions
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block mt-1">
            {overview.totalSessions}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Stored practice takes</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Practice Time
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block mt-1">
            {overview.totalTimeFormatted}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Total recorded duration</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Avg Score
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block mt-1">
            {overview.averageScore}%
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
            {f0Sessions.length > 0 ? 'F0 + prototype avg' : 'Prototype performance avg'}
          </span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Avg Consistency
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block mt-1">
            {overview.averageConsistency}%
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
            {f0Sessions.length > 0 ? 'F0 + prototype avg' : 'Prototype consistency avg'}
          </span>
        </Card>
      </section>

      {/* F0 Trend Analysis (only when enough real data) */}
      {hasEnoughF0Data && f0Averages && (
        <section aria-label="F0 Pitch Trend Analysis">
          <Card className="overflow-hidden border-emerald-200/80 bg-emerald-50/30">
            <Card.Header className="py-4 border-emerald-200/60">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  F0 Pitch Signal Trends
                </h2>
                <Badge variant="success" className="text-[10px] font-semibold">
                  Real Analysis Data
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Derived from {f0Averages.count} F0 analysis session{f0Averages.count !== 1 ? 's' : ''}
              </p>
            </Card.Header>
            <Card.Content className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-white border border-slate-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                    Avg Median Pitch
                  </span>
                  <span className="text-xl font-bold text-slate-900 block mt-1">
                    {f0Averages.avgMedianHz.toFixed(1)} Hz
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                    Avg Stability
                  </span>
                  <span className="text-xl font-bold text-slate-900 block mt-1">
                    {(f0Averages.avgStability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                    Avg Voicing Ratio
                  </span>
                  <span className="text-xl font-bold text-slate-900 block mt-1">
                    {(f0Averages.avgVoicingRatio * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </section>
      )}

      {/* Not enough F0 data message */}
      {!hasEnoughF0Data && f0Sessions.length > 0 && (
        <section aria-label="F0 Trend Notice">
          <Card className="p-4 border-emerald-200/60 bg-emerald-50/20">
            <p className="text-xs text-emerald-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              You have {f0Sessions.length} F0 analysis session{f0Sessions.length !== 1 ? 's' : ''}.
              More analysed sessions are needed for F0 trend analysis (at least 2 with detectable pitch).
            </p>
          </Card>
        </section>
      )}

      {/* B. Progress Trend */}
      <section aria-label="Progress Trend">
        <ProgressChart data={trendData} />
      </section>

      {/* C & D: Practice Frequency + Performance Breakdown */}
      <section
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        aria-label="Practice Frequency and Performance Breakdown"
      >
        <PracticeFrequencyChart data={frequencyData} />
        <MetricTrend breakdown={breakdown} />
      </section>

      {/* E. Highlights */}
      <section aria-label="Session Highlights">
        <Card className="overflow-hidden">
          <Card.Header className="py-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Session Highlights</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Notable sessions from your practice history
            </p>
          </Card.Header>

          <Card.Content className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Strongest Session */}
              {highlights.strongest && (
                <div className="p-4 rounded-xl bg-primary-50/60 border border-primary-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-600 block">
                    Strongest Session
                  </span>
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100 block mt-1">
                    {highlights.strongest.score}%
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">
                    {highlights.strongest.title}
                  </p>
                  {highlights.strongest.source === 'user' && highlights.strongest.analysisVersion?.startsWith('f0-') && (
                    <span className="text-[10px] text-emerald-600 font-medium">F0 analysis</span>
                  )}
                </div>
              )}

              {/* Longest Session */}
              {highlights.longest && (
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 block">
                    Longest Session
                  </span>
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100 block mt-1">
                    {highlights.longest.duration}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">
                    {highlights.longest.title}
                  </p>
                </div>
              )}

              {/* Score Delta */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Score Change
                </span>
                {highlights.scoreDelta !== null ? (
                  <>
                    <span
                      className={`text-xl font-bold block mt-1 ${
                        highlights.scoreDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {highlights.scoreDelta >= 0 ? '+' : ''}
                      {highlights.scoreDelta}%
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      Change across saved sessions (earliest to latest)
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-xl font-bold text-slate-400 block mt-1">—</span>
                    <p className="text-xs text-slate-400 mt-1">
                      Requires 2+ sessions to calculate
                    </p>
                  </>
                )}
              </div>
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* F. Focus Areas */}
      {focusTags.length > 0 && (
        <section aria-label="Focus Areas">
          <Card className="overflow-hidden">
            <Card.Header className="py-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Practice Focus Areas</h2>
                <Badge variant="neutral" className="text-[10px] font-semibold">
                  From saved sessions
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Focus areas recorded across your practice takes
              </p>
            </Card.Header>

            <Card.Content className="p-5">
              <div className="flex flex-wrap gap-2">
                {focusTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-3 italic">
                Focus tags are derived from session data — not from automated intelligence or weakness detection.
              </p>
            </Card.Content>
          </Card>
        </section>
      )}

      {/* Status Footer */}
      <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 py-2 border-t border-slate-100 dark:border-slate-800">
        {f0Sessions.length > 0
          ? `Analytics values include ${f0Sessions.length} real F0 analysis session${f0Sessions.length !== 1 ? 's' : ''} and ${sessions.length - f0Sessions.length} demo session${sessions.length - f0Sessions.length !== 1 ? 's' : ''}.`
          : 'Analytics values are computed from stored session data. Prototype metrics are for demonstration purposes.'}
      </div>
    </div>
  );
}
