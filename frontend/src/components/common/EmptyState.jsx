const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => (
  <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
    {Icon && (
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
        <Icon className="w-8 h-8" />
      </div>
    )}
    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
    {description && <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;