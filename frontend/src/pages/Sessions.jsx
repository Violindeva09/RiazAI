import { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import SessionListCard from '../components/sessions/SessionListCard';
import SessionDetailModal from '../components/sessions/SessionDetailModal';
import { NavIcon } from '../components/navigation/NavIcons';
import { getStoredSessions, deleteSession, resetToDemoSessions } from '../utils/storage';
import { calculateOverview } from '../utils/analyticsCalculations';
import { getUniqueInstruments } from '../utils/analyticsCalculations';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState('');
  const [instrumentFilter, setInstrumentFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    setSessions(getStoredSessions());
  }, []);

  // Derived values
  const instruments = useMemo(() => getUniqueInstruments(sessions), [sessions]);
  const overview = useMemo(() => calculateOverview(sessions), [sessions]);

  // Filtered + sorted sessions
  const filteredSessions = useMemo(() => {
    let result = [...sessions];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          (s.title || '').toLowerCase().includes(q) ||
          (s.focus || '').toLowerCase().includes(q)
      );
    }

    // Instrument filter
    if (instrumentFilter !== 'All') {
      result = result.filter((s) => s.instrument === instrumentFilter);
    }

    // Source filter
    if (sourceFilter === 'User') {
      result = result.filter((s) => s.source === 'user');
    } else if (sourceFilter === 'Demo') {
      result = result.filter((s) => s.source === 'demo');
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'highest':
        result.sort((a, b) => (b.score || 0) - (a.score || 0));
        break;
      case 'longest':
        result.sort((a, b) => (b.durationMinutes || 0) - (a.durationMinutes || 0));
        break;
      default:
        break;
    }

    return result;
  }, [sessions, search, instrumentFilter, sourceFilter, sortBy]);

  const handleDelete = (sessionId) => {
    const updated = deleteSession(sessionId);
    setSessions(updated);
  };

  const handleReset = () => {
    const demo = resetToDemoSessions();
    setSessions(demo);
  };

  const hasNoSessionsAtAll = sessions.length === 0;
  const hasNoFilterResults = !hasNoSessionsAtAll && filteredSessions.length === 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Practice Sessions
            </h1>
            <Badge variant="primary" className="text-xs font-semibold">
              {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
            </Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Your practice history, saved takes, and session consistency records.
          </p>
        </div>

        <NavLink
          to="/analyse"
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-xs transition-colors flex items-center gap-2 shrink-0"
        >
          <NavIcon name="analyse" className="w-4 h-4" />
          <span>Analyse Session</span>
        </NavLink>
      </div>

      {/* Summary Metrics */}
      {!hasNoSessionsAtAll && (
        <section aria-label="Session Summary" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Total Sessions
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block mt-1">
              {overview.totalSessions}
            </span>
          </Card>
          <Card className="p-4 text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Practice Time
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block mt-1">
              {overview.totalTimeFormatted}
            </span>
          </Card>
          <Card className="p-4 text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Avg Score
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block mt-1">
              {overview.averageScore}%
            </span>
          </Card>
          <Card className="p-4 text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Avg Consistency
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block mt-1">
              {overview.averageConsistency}%
            </span>
          </Card>
        </section>
      )}

      {/* Search & Filters */}
      {!hasNoSessionsAtAll && (
        <Card>
          <div className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="search"
                placeholder="Search sessions by title or focus..."
                className="input"
                aria-label="Search sessions"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="input w-auto"
                aria-label="Filter by instrument"
                value={instrumentFilter}
                onChange={(e) => setInstrumentFilter(e.target.value)}
              >
                <option value="All">All Instruments</option>
                {instruments.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
              <select
                className="input w-auto"
                aria-label="Filter by source"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                <option value="All">All Sources</option>
                <option value="User">User Takes</option>
                <option value="Demo">Demo Sessions</option>
              </select>
              <select
                className="input w-auto"
                aria-label="Sort sessions"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Score</option>
                <option value="longest">Longest Duration</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Session List */}
      {hasNoSessionsAtAll && (
        <Card className="py-8">
          <EmptyState
            icon={(props) => <NavIcon name="sessions" {...props} />}
            title="No practice sessions yet"
            description="Complete an audio analysis to record your first practice session and start tracking your progress."
            action={
              <NavLink
                to="/analyse"
                className="btn-primary inline-flex items-center gap-2"
              >
                <NavIcon name="analyse" className="w-4 h-4" />
                Start Your First Analysis
              </NavLink>
            }
          />
        </Card>
      )}

      {hasNoFilterResults && (
        <Card className="py-8">
          <EmptyState
            title="No sessions match your filters"
            description="Try adjusting your search or filter criteria."
            action={
              <button
                className="btn-secondary"
                onClick={() => {
                  setSearch('');
                  setInstrumentFilter('All');
                  setSourceFilter('All');
                  setSortBy('newest');
                }}
              >
                Clear All Filters
              </button>
            }
          />
        </Card>
      )}

      {filteredSessions.length > 0 && (
        <section aria-label="Session List" className="space-y-3">
          {filteredSessions.map((session) => (
            <SessionListCard
              key={session.id}
              session={session}
              onViewDetails={setSelectedSession}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}

      {/* Footer Actions */}
      {!hasNoSessionsAtAll && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
          <span>
            Showing {filteredSessions.length} of {sessions.length} session
            {sessions.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-4">
            <NavLink
              to="/analytics"
              className="text-primary-600 font-semibold hover:underline"
            >
              View Analytics →
            </NavLink>
            <button
              onClick={handleReset}
              className="text-slate-400 hover:text-slate-600 font-medium transition-colors"
            >
              Reset to Demo Data
            </button>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}