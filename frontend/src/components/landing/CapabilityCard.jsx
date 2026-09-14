import Badge from '../common/Badge';

export default function CapabilityCard({ title, description, badgeText, badgeVariant = 'primary', icon, currentStatus }) {
  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
            {icon}
          </div>
          {badgeText && (
            <Badge variant={badgeVariant} className="text-[10px] font-semibold uppercase tracking-wider">
              {badgeText}
            </Badge>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-400 uppercase tracking-wider text-[10px]">Architecture</span>
        <span className="font-medium text-slate-700">{currentStatus}</span>
      </div>
    </div>
  );
}
