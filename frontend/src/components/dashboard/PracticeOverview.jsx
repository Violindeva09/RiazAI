import Card from '../common/Card';
import Badge from '../common/Badge';

export default function PracticeOverview({ overview }) {
  const { totalSessions, totalPracticeTime, goalPercentage, currentStreakDays, weeklyGoalHours, dailyLog } = overview;

  return (
    <Card className="overflow-hidden">
      <Card.Header className="flex items-center justify-between py-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Weekly Practice Overview</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Summary of your deliberate riaz routine this week</p>
        </div>
        <Badge variant="neutral" className="text-[11px] font-semibold">
          Week 37
        </Badge>
      </Card.Header>

      <Card.Content className="p-5 space-y-6">
        {/* 4 Summary Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sessions Logged</span>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalSessions}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Total recorded takes</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Practice Time</span>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalPracticeTime}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Target: {weeklyGoalHours}h / week</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Goal Reached</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{goalPercentage}%</span>
              <span className="text-xs text-emerald-600 font-semibold">On Track</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Weekly routine goal</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Streak</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{currentStreakDays}</span>
              <span className="text-xs font-semibold text-amber-600">Days 🔥</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Daily practice continuity</p>
          </div>
        </div>

        {/* Goal Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Weekly Goal Progress ({totalPracticeTime} of {weeklyGoalHours}h)</span>
            <span className="font-bold text-primary-700">{goalPercentage}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(goalPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Day-by-Day Activity Dots / Bars */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Daily Practice Continuity</span>
            <span className="text-[11px] text-slate-400">5 of 7 days logged</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {dailyLog.map((day) => (
              <div
                key={day.dayName}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                  day.completed
                    ? 'bg-primary-50/70 border-primary-200/80 text-primary-900'
                    : 'bg-slate-50 border-slate-200/60 text-slate-400'
                }`}
              >
                <span className="text-[11px] font-semibold">{day.dayName}</span>
                <span className="text-xs font-bold mt-1">
                  {day.completed ? `${day.minutes}m` : '—'}
                </span>
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 ${
                    day.completed ? 'bg-primary-600' : 'bg-slate-200'
                  }`}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
