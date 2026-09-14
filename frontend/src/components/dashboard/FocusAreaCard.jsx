import Card from '../common/Card';
import Badge from '../common/Badge';

export default function FocusAreaCard({ focus }) {
  const { title, badge, subtitle, description, tag, suggestedExercise } = focus;

  return (
    <Card className="border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 overflow-hidden">
      <Card.Header className="py-3.5 border-amber-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-600 text-sm" aria-hidden="true">💡</span>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Example Focus Area</span>
        </div>
        <Badge variant="warning" className="text-[10px] font-semibold">
          {badge}
        </Badge>
      </Card.Header>

      <Card.Content className="p-5 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
            {tag && (
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {tag}
              </span>
            )}
          </div>
          <p className="text-xs text-amber-800/80 font-medium mt-0.5">{subtitle}</p>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>

        {suggestedExercise && (
          <div className="p-3 rounded-lg bg-amber-100/50 border border-amber-200/60 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-amber-950 block">Suggested Exercise Routine:</span>
            <p className="leading-relaxed text-amber-900/90">{suggestedExercise}</p>
          </div>
        )}

        <div className="pt-2 border-t border-amber-100/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Demonstration practice prompt</span>
          <span className="italic text-slate-500 dark:text-slate-400">Not based on automated weakness detection</span>
        </div>
      </Card.Content>
    </Card>
  );
}
