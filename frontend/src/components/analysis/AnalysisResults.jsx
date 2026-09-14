import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import MetricBreakdown from './MetricBreakdown';
import F0AnalysisResults from './F0AnalysisResults';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { saveSession } from '../../utils/storage';

/**
 * Display analysis results — either real F0 or demo fallback.
 *
 * @param {Object} results - AnalysisResponse from backend or demo fallback
 * @param {File} file - The uploaded file
 * @param {Function} onReset - Reset workflow
 * @param {boolean} isRealAnalysis - Whether this is real F0 data
 */
export default function AnalysisResults({ results, file, onReset, isRealAnalysis }) {
  const [saved, setSaved] = useState(false);

  const handleSaveSession = () => {
    if (isRealAnalysis && results.pitch) {
      // Save as real F0 analysis session
      saveSession({
        title: file?.name ? `F0 Take — ${file.name.replace(/\\.[^/.]+$/, '')}` : 'F0 Practice Take',
        duration: results.audio?.durationSeconds
          ? `${Math.floor(results.audio.durationSeconds / 60)}m ${Math.round(results.audio.durationSeconds % 60)}s`
          : '0m 0s',
        durationMinutes: results.audio?.durationSeconds
          ? Math.round(results.audio.durationSeconds / 60) || 1
          : 0,
        instrument: 'Recorded Audio',
        focus: 'F0 Pitch Signal Analysis',
        source: 'user',
        analysisVersion: results.analysisVersion,
        // F0 metrics
        pitchAvailable: results.pitch?.available ?? false,
        medianHz: results.pitch?.medianHz,
        rangeHz: results.pitch?.rangeHz,
        pitchStability: results.pitch?.stability,
        voicingRatio: results.pitch?.voicingRatio,
        frameCount: results.pitch?.frameCount,
        // Score derived from stability for backward compat
        score: results.pitch?.stability ? results.pitch.stability * 100 : 0,
        accuracy: results.pitch?.voicingRatio ? results.pitch.voicingRatio * 100 : 0,
        stability: results.pitch?.stability ? results.pitch.stability * 100 : 0,
        consistency: results.pitch?.stability ? results.pitch.stability * 100 : 0,
        consistencyLabel: results.pitch?.stability
          ? results.pitch.stability > 0.8 ? 'Steady' : results.pitch.stability > 0.5 ? 'Moderate' : 'Variable'
          : 'N/A',
        // Audio metadata
        sampleRate: results.audio?.sampleRate,
        processingTimeMs: results.processing?.processingTimeMs,
        // Legacy demo fields (null for real analysis)
        feedback: '',
        nextStep: '',
        // Analysis metadata
        date: 'Just now',
        createdAt: new Date().toISOString(),
        status: 'Completed',
      });
    } else {
      // Save as demo/heuristic session (backward compatible)
      saveSession({
        title: file?.name ? `Riaz Take — ${file.name.replace(/\.[^/.]+$/, '')}` : 'Riaz Practice Take',
        duration: results.audio?.durationSeconds
          ? `${Math.floor(results.audio.durationSeconds / 60)}m ${Math.round(results.audio.durationSeconds % 60)}s`
          : '3m 42s',
        instrument: 'Recorded Audio',
        focus: 'Acoustic Energy & Stability',
        source: 'user',
        score: results.metrics?.overallScore ?? results.metrics?.stabilityPercentage ?? 86,
        accuracy: results.metrics?.voicingPercentage ?? results.metrics?.accuracyPercentage ?? 88,
        stability: results.metrics?.stabilityPercentage ?? 84,
        consistency: results.metrics?.stabilityPercentage ?? 87,
        consistencyLabel: 'Steady',
        feedback: results.feedback || '',
        nextStep: '',
        date: 'Just now',
        createdAt: new Date().toISOString(),
        status: 'Completed',
      });
    }
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      {/* Analysis Type Banner */}
      {isRealAnalysis ? (
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-bold text-emerald-950">Real F0 analysis</span>
            <span className="text-emerald-800 hidden md:inline">
              — Backend YIN pitch extraction with derived metrics.
            </span>
          </div>
          <Badge variant="success" className="self-start sm:self-auto text-[10px] font-semibold">
            F0 Engine
          </Badge>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="font-bold text-amber-950">Demonstration analysis</span>
            <span className="text-amber-800 hidden md:inline">
              — Simulated heuristic metrics. Backend unavailable.
            </span>
          </div>
          <Badge variant="warning" className="self-start sm:self-auto text-[10px] font-semibold">
            Fallback Mode
          </Badge>
        </div>
      )}

      {/* F0 Metrics Display (for real analysis) */}
      {isRealAnalysis && results.pitch && (
        <section aria-label="F0 Pitch Analysis Results">
          <F0AnalysisResults results={results} file={file} />
        </section>
      )}

      {/* Legacy Metric Breakdown (for demo/fallback) */}
      {!isRealAnalysis && (
        <section aria-label="Analysis Performance Metrics">
          <MetricBreakdown results={results} />
        </section>
      )}

      {/* Feedback Summary & Session Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feedback / Notes */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col justify-between">
            <Card.Header className="py-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isRealAnalysis ? 'F0 Analysis Notes' : 'Session Feedback Summary'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isRealAnalysis
                  ? 'Pitch signal observations from this analysis'
                  : 'Automated signal observations from this take'}
              </p>
            </Card.Header>
            <Card.Content className="p-5 space-y-4">
              {isRealAnalysis ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {results.pitch?.available
                      ? `Median pitch: ${results.metrics?.pitchDisplay || `${results.pitch.medianHz?.toFixed(1)} Hz`}. ` +
                        `Pitch range: ${results.pitch.rangeHz?.toFixed(1)} Hz. ` +
                        `Stability: ${(results.pitch.stability * 100)?.toFixed(0)}%. ` +
                        `Voicing ratio: ${(results.pitch.voicingRatio * 100)?.toFixed(0)}%.`
                      : 'No pitched material was detected in this recording.'}
                  </p>
                  {results.feedback && (
                    <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                      {results.feedback}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 italic">
                    These are raw pitch measurements, not pedagogical assessments.
                    F0 analysis identifies the fundamental frequency of monophonic audio signals.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {results.feedback}
                  </p>
                  {results.focusPoints?.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Observed Focus Points
                      </span>
                      <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                        {results.focusPoints.map((point, idx) => (
                          <li key={idx} className="leading-relaxed">{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Session Details & Analysis Metadata */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <Card.Header className="py-3.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {isRealAnalysis ? 'Analysis Details' : 'Session Take Details'}
              </h3>
            </Card.Header>
            <Card.Content className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 dark:text-slate-500">File Name</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                  {file?.name || 'practice_recording.wav'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 dark:text-slate-500">Duration</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {results.audio?.durationSeconds
                    ? `${results.audio.durationSeconds.toFixed(1)}s`
                    : results.durationFormatted || '3m 42s'}
                </span>
              </div>
              {isRealAnalysis ? (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-400 dark:text-slate-500">Sample Rate</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {results.audio?.sampleRate || '—'} Hz
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-400 dark:text-slate-500">Processing Time</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {results.processing?.processingTimeMs?.toFixed(0) || '—'}ms
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 dark:text-slate-500">Engine</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {results.analysisVersion || 'f0-yin-1.0'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-400 dark:text-slate-500">Signal Stability</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {results.signalEnergy || 'Steady'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 dark:text-slate-500">Dynamic Range</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {results.dynamicRange || 'Balanced'}
                    </span>
                  </div>
                </>
              )}
            </Card.Content>
          </Card>

          {/* Suggested Next Step (demo only) */}
          {!isRealAnalysis && results.suggestedNextStep && (
            <Card className="bg-primary-50/50 border-primary-100">
              <Card.Header className="py-3 border-primary-100/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary-900">
                  Suggested Next Step
                </h3>
              </Card.Header>
              <Card.Content className="p-4">
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {results.suggestedNextStep}
                </p>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {saved ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Session saved to local practice history!</span>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Save this session to track consistency on your dashboard and session history.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {!saved ? (
            <Button
              variant="primary"
              onClick={handleSaveSession}
              className="w-full sm:w-auto"
            >
              Save Session
            </Button>
          ) : (
            <NavLink
              to="/sessions"
              className="btn-secondary w-full sm:w-auto text-xs"
            >
              View in Sessions
            </NavLink>
          )}

          <Button
            variant="secondary"
            onClick={onReset}
            className="w-full sm:w-auto"
          >
            Analyse Another
          </Button>

          <NavLink
            to="/dashboard"
            className="btn-ghost w-full sm:w-auto text-xs"
          >
            View Dashboard →
          </NavLink>
        </div>
      </div>
    </div>
  );
}
