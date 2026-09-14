import F0MetricCard from './F0MetricCard';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * Displays real F0 pitch analysis results from the backend.
 *
 * <p>Only shows real measurements — never fabricates values.
 * Clearly labels everything as "F0 / Pitch Signal Analysis".</p>
 *
 * @param {Object} results - AnalysisResponse from backend
 * @param {Object} file - The uploaded file object
 */
export default function F0AnalysisResults({ results, file }) {
  if (!results || !results.pitch) return null;

  const { pitch, audio, processing, metrics } = results;

  if (!pitch.available) {
    return (
      <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="font-bold text-amber-950 text-sm">No Pitch Detected</span>
        </div>
        <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
          {results.feedback || 'No voiced material was detected in this recording. Try recording with a clearer signal.'}
        </p>
        {audio?.durationSeconds > 0 && (
          <p className="text-[11px] text-amber-700">
            Audio duration: {audio.durationSeconds.toFixed(1)}s • Sample rate: {audio.sampleRate} Hz
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* F0 Analysis Header */}
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="primary" className="text-[10px] font-semibold">
          F0 / Pitch Signal Analysis
        </Badge>
        <span className="text-[11px] text-slate-400">
          YIN algorithm • {results.analysisVersion}
        </span>
      </div>

      {/* Primary F0 Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <F0MetricCard
          label="Median Pitch"
          value={metrics?.pitchDisplay || `${pitch.medianHz?.toFixed(1)} Hz`}
          subtitle={`Median F0 across ${pitch.frameCount} frames`}
          highlight={true}
        />

        <F0MetricCard
          label="Pitch Range"
          value={pitch.rangeHz != null ? `${pitch.rangeHz.toFixed(1)} Hz` : '—'}
          subtitle="F0 range (max − min)"
          highlight={false}
        />

        <F0MetricCard
          label="Pitch Stability"
          value={pitch.stability != null ? `${(pitch.stability * 100).toFixed(0)}%` : '—'}
          subtitle={pitch.stability != null
            ? pitch.stability > 0.8
              ? 'Steady pitch control'
              : pitch.stability > 0.5
                ? 'Moderate pitch variation'
                : 'Significant pitch variation'
            : 'Insufficient data'}
          highlight={false}
        />

        <F0MetricCard
          label="Voicing Ratio"
          value={pitch.voicingRatio != null ? `${(pitch.voicingRatio * 100).toFixed(0)}%` : '—'}
          subtitle="Frames with detectable pitch"
          highlight={false}
        />
      </div>

      {/* Audio Metadata */}
      {audio && (
        <Card className="p-3">
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
            <span>
              Duration: <strong className="text-slate-700">{audio.durationSeconds?.toFixed(1)}s</strong>
            </span>
            <span>
              Sample rate: <strong className="text-slate-700">{audio.sampleRate} Hz</strong>
            </span>
            <span>
              Frames: <strong className="text-slate-700">{pitch.frameCount}</strong>
            </span>
            {processing?.processingTimeMs != null && (
              <span>
                Processing: <strong className="text-slate-700">{processing.processingTimeMs.toFixed(0)}ms</strong>
              </span>
            )}
          </div>
        </Card>
      )}

      {/* Limitation Notice */}
      <div className="text-[10px] text-slate-400 dark:text-slate-500 italic">
        F0 measurements are raw pitch signal data — not pedagogical interpretation.
        Stability reflects F0 coefficient of variation, not playing quality.
      </div>
    </div>
  );
}
