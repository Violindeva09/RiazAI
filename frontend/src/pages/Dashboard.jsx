import { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import MetricCard from '../components/dashboard/MetricCard';
import PracticeOverview from '../components/dashboard/PracticeOverview';
import ProgressTrend from '../components/dashboard/ProgressTrend';
import SessionCard from '../components/dashboard/SessionCard';
import FocusAreaCard from '../components/dashboard/FocusAreaCard';
import QuickActions from '../components/dashboard/QuickActions';
import Card from '../components/common/Card';
import { NavIcon } from '../components/navigation/NavIcons';
import { dashboardMetrics, practiceOverview, progressData, focusArea } from '../data/demoData';
import { getStoredSessions } from '../utils/storage';

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    setSessions(getStoredSessions());
  }, []);

  // Derive real F0 metrics from user sessions
  const f0Sessions = useMemo(
    () => sessions.filter((s) => s.source === 'user' && s.analysisVersion?.startsWith('f0-')),
    [sessions]
  );

  const hasRealF0Data = f0Sessions.length > 0;

  // Compute F0-specific dashboard metrics
  const f0Metrics = useMemo(() => {
    if (!hasRealF0Data) return null;
    const withPitch = f0Sessions.filter((s) => s.pitchAvailable && s.medianHz > 0);
    if (withPitch.length === 0) return null;

    const avgMedianHz = withPitch.reduce((sum, s) => sum + s.medianHz, 0) / withPitch.length;
    const avgStability = withPitch.reduce((sum, s) => sum + (s.pitchStability || 0), 0) / withPitch.length;
    const avgVoicing = withPitch.reduce((sum, s) => sum + (s.voicingRatio || 0), 0) / withPitch.length;

    return { avgMedianHz, avgStability, avgVoicing, count: withPitch.length };
  }, [f0Sessions, hasRealF0Data]);

  return (
    <div className="space-y-8">
      {/* Header with Title, Description & CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Dashboard
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200/60">
              {hasRealF0Data ? 'F0 Engine' : 'Prototype Mode'}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Welcome back, Musician. Here is your practice consistency overview and recent activity.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <NavLink
            to="/journal"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
          >
            Log Practice
          </NavLink>
          <NavLink
            to="/analyse"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-xs transition-colors flex items-center gap-2"
          >
            <NavIcon name="analyse" className="w-4 h-4" />
            <span>Analyse a Session</span>
          </NavLink>
        </div>
      </div>

      {/* Overview Metrics (4 Cards) */}
      <section aria-label="Practice Metrics Overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label={dashboardMetrics.performanceScore.label}
            value={dashboardMetrics.performanceScore.value}
            change={dashboardMetrics.performanceScore.change}
            isPositive={dashboardMetrics.performanceScore.isPositive}
            caption={dashboardMetrics.performanceScore.caption}
            icon={<NavIcon name="analytics" className="w-5 h-5" />}
          />
          <MetricCard
            label={dashboardMetrics.sessionConsistency.label}
            value={dashboardMetrics.sessionConsistency.value}
            status={dashboardMetrics.sessionConsistency.status}
            caption={dashboardMetrics.sessionConsistency.caption}
            icon={<NavIcon name="analyse" className="w-5 h-5" />}
          />
          <MetricCard
            label={dashboardMetrics.practiceTime.label}
            value={dashboardMetrics.practiceTime.value}
            status={dashboardMetrics.practiceTime.status}
            caption={dashboardMetrics.practiceTime.caption}
            icon={<NavIcon name="sessions" className="w-5 h-5" />}
          />
          <MetricCard
            label={dashboardMetrics.practiceStreak.label}
            value={dashboardMetrics.practiceStreak.value}
            status={dashboardMetrics.practiceStreak.status}
            caption={dashboardMetrics.practiceStreak.caption}
            icon={<NavIcon name="goals" className="w-5 h-5" />}
          />
        </div>
      </section>

      {/* Real F0 Summary (if we have real analysis data) */}
      {f0Metrics && (
        <section aria-label="F0 Analysis Summary">
          <Card className="overflow-hidden border-emerald-200/80 bg-emerald-50/30">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  F0 Pitch Analysis Summary
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200/60">
                  {f0Metrics.count} real analysis{f0Metrics.count !== 1 ? 'es' : ''}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                    Avg Median Pitch
                  </span>
                  <span className="text-lg font-bold text-slate-900 block mt-0.5">
                    {f0Metrics.avgMedianHz.toFixed(1)} Hz
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                    Avg Stability
                  </span>
                  <span className="text-lg font-bold text-slate-900 block mt-0.5">
                    {(f0Metrics.avgStability * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                    Avg Voicing
                  </span>
                  <span className="text-lg font-bold text-slate-900 block mt-0.5">
                    {(f0Metrics.avgVoicing * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Practice Overview & Progress Trend */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6" aria-label="Weekly Routine & Trends">
        <div className="lg:col-span-6">
          <PracticeOverview overview={practiceOverview} />
        </div>
        <div className="lg:col-span-6">
          <ProgressTrend data={progressData} />
        </div>
      </section>

      {/* Focus Area Recommendation */}
      <section aria-label="Example Focus Area">
        <FocusAreaCard focus={focusArea} />
      </section>

      {/* Recent Sessions List */}
      <section aria-label="Recent Practice Sessions">
        <Card className="overflow-hidden">
          <Card.Header className="py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Sessions</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Recorded practice runs and audio analysis history</p>
            </div>
            <NavLink
              to="/sessions"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              View All Sessions →
            </NavLink>
          </Card.Header>

          <Card.Content className="p-4 sm:p-5 space-y-3">
            {sessions.length > 0 ? (
              sessions.slice(0, 4).map((sess) => (
                <SessionCard key={sess.id} session={sess} />
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                No practice sessions recorded yet. Start by analysing your first audio take!
              </div>
            )}
          </Card.Content>

          <Card.Footer className="py-3 px-5 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>Showing recent practice history</span>
            <NavLink to="/analyse" className="text-primary-600 font-semibold hover:underline">
              Upload New Audio →
            </NavLink>
          </Card.Footer>
        </Card>
      </section>

      {/* Quick Actions Bar */}
      <section aria-label="Quick Actions">
        <QuickActions />
      </section>
    </div>
  );
}
