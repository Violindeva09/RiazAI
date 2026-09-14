import { formatFileSize } from '../../config/audioConfig';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { NavIcon } from '../navigation/NavIcons';

export default function SelectedFile({ file, onRemove, onStartAnalysis }) {
  if (!file) return null;

  const extension = file.name.slice(file.name.lastIndexOf('.')).replace('.', '').toUpperCase();

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* File Details */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center border border-primary-200/60 shrink-0">
            <NavIcon name="analyse" className="w-6 h-6" />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{file.name}</p>
              <Badge variant="primary" className="text-[10px] font-bold">
                {extension || 'AUDIO'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Size: <strong className="font-semibold text-slate-700 dark:text-slate-200">{formatFileSize(file.size)}</strong> • Ready for F0 pitch analysis
            </p>
          </div>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={onRemove}
          className="self-start sm:self-center px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors border border-slate-200/80 dark:border-slate-600/80 hover:border-rose-200"
          aria-label="Remove selected audio file"
        >
          Remove File
        </button>
      </div>

      {/* Contract Notice */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
        <span className="text-primary-600 font-bold" aria-hidden="true">ℹ</span>
        <p className="leading-relaxed">
          Your audio will be uploaded to the backend for real F0 pitch analysis using the YIN algorithm. The file will be processed server-side and results returned as JSON.
        </p>
      </div>

      {/* Primary Action Button */}
      <div className="flex justify-end pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={onStartAnalysis}
          className="w-full sm:w-auto px-8 font-semibold shadow-xs"
        >
          Analyse Recording &rarr;
        </Button>
      </div>
    </div>
  );
}
