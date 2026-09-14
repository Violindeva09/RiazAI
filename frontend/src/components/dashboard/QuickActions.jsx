import { NavLink } from 'react-router-dom';
import Card from '../common/Card';
import { NavIcon } from '../navigation/NavIcons';

export default function QuickActions() {
  const actions = [
    {
      label: 'Analyse Session',
      to: '/analyse',
      description: 'Upload audio to inspect performance metrics',
      variant: 'primary',
      iconName: 'analyse',
    },
    {
      label: 'Log Practice',
      to: '/journal',
      description: 'Record notes, mood & exercises practiced',
      variant: 'secondary',
      iconName: 'journal',
    },
    {
      label: 'View Sessions',
      to: '/sessions',
      description: 'Browse complete historical practice logs',
      variant: 'secondary',
      iconName: 'sessions',
    },
    {
      label: 'Set Goal',
      to: '/goals',
      description: 'Configure practice targets & routine milestones',
      variant: 'ghost',
      iconName: 'goals',
    },
  ];

  return (
    <Card className="overflow-hidden">
      <Card.Header className="py-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Quick Actions</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Frequent tools for your daily practice workflow</p>
      </Card.Header>

      <Card.Content className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act) => (
          <NavLink
            key={act.label}
            to={act.to}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
              act.variant === 'primary'
                ? 'bg-primary-600 border-primary-600 text-white shadow-xs hover:bg-primary-700 hover:border-primary-700'
                : 'bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
          >
            <div className="space-y-2">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  act.variant === 'primary'
                    ? 'bg-primary-500/80 text-white'
                    : 'bg-primary-50 text-primary-600'
                }`}
              >
                <NavIcon name={act.iconName} className="w-5 h-5" />
              </div>

              <div>
                <span className="text-sm font-bold block">{act.label}</span>
                <p
                  className={`text-xs mt-1 leading-relaxed ${
                    act.variant === 'primary' ? 'text-primary-100' : 'text-slate-500'
                  }`}
                >
                  {act.description}
                </p>
              </div>
            </div>

            <div
              className={`mt-4 pt-2 border-t flex items-center justify-between text-xs font-semibold ${
                act.variant === 'primary'
                  ? 'border-primary-500 text-primary-100 group-hover:text-white'
                  : 'border-slate-100 text-primary-600 group-hover:text-primary-700'
              }`}
            >
              <span>Launch</span>
              <span>&rarr;</span>
            </div>
          </NavLink>
        ))}
      </Card.Content>
    </Card>
  );
}
