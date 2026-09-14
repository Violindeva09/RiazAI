import { useState, useCallback } from 'react';
import AudioDropzone from '../components/analysis/AudioDropzone';
import SelectedFile from '../components/analysis/SelectedFile';
import AnalysisProgress from '../components/analysis/AnalysisProgress';
import AnalysisResults from '../components/analysis/AnalysisResults';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { uploadForAnalysis, ApiError } from '../services/api';
import { demoAnalysisResult } from '../data/demoData';

const WORKFLOW_STATES = {
  READY: 'READY',
  UPLOADING: 'UPLOADING',
  ANALYSING: 'ANALYSING',
  RESULTS: 'RESULTS',
};

export default function Analyse() {
  const [currentState, setCurrentState] = useState(WORKFLOW_STATES.READY);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analysisSource, setAnalysisSource] = useState(null); // 'real' | 'demo'
  const [analysisError, setAnalysisError] = useState(null);
  const [analysisPhase, setAnalysisPhase] = useState('uploading');

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setValidationError(null);
    setAnalysisError(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationError(null);
    setAnalysisError(null);
  };

  const handleStartAnalysis = useCallback(async () => {
    if (!selectedFile) {
      setValidationError('Please select or drop an audio recording before analysing.');
      return;
    }

    setValidationError(null);
    setAnalysisError(null);
    setCurrentState(WORKFLOW_STATES.UPLOADING);
    setAnalysisPhase('uploading');

    try {
      // Phase 1: Upload and Analyse
      // The backend does both. We update the phase to 'analysing' immediately 
      // after upload starts to reflect server-side processing.
      setAnalysisPhase('uploading');
      
      // We can't easily track upload progress without XHR, so we simulate 
      // a transition to 'analysing' after a short delay or just call the API.
      setTimeout(() => setAnalysisPhase('analysing'), 1000);

      const result = await uploadForAnalysis(selectedFile, { timeoutMs: 30000 });

      // Phase 3: Results
      if (!result) {
        throw new Error('No result returned from analysis');
      }
      
      // Backend response already includes 'analysisVersion' and 'audio' data.
      // We ensure the source is 'real' for real API responses.
      setAnalysisResults({
        ...result,
        source: 'real', 
      });
      setAnalysisSource('real');
      setAnalysisPhase('complete');
      setCurrentState(WORKFLOW_STATES.RESULTS);
    } catch (err) {
      console.warn('Backend analysis failed, using demo fallback:', err.message);

      setAnalysisResults({
        ...demoAnalysisResult,
        source: 'demo',
        fallback: true,
        analysisVersion: 'heuristic-prototype-v1',
        feedback: err instanceof ApiError ? err.message : 'Backend analysis unavailable. Showing demonstration metrics.',
      });
      setAnalysisSource('demo');
      setAnalysisPhase('complete');
      setCurrentState(WORKFLOW_STATES.RESULTS);

      if (err instanceof ApiError && err.status === 0) {
        setAnalysisError('Backend server is not available. Showing demo results.');
      } else {
        setAnalysisError(err.message);
      }
    }
  }, [selectedFile]);

  const handleReset = () => {
    setSelectedFile(null);
    setValidationError(null);
    setAnalysisResults(null);
    setAnalysisSource(null);
    setAnalysisError(null);
    setAnalysisPhase('uploading');
    setCurrentState(WORKFLOW_STATES.READY);
  };

  const isRealAnalysis = analysisSource === 'real';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200/80 dark:border-slate-700/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Audio Analysis
            </h1>
            <Badge variant={isRealAnalysis ? 'success' : 'primary'} className="text-xs font-semibold">
              {isRealAnalysis ? 'F0 Engine' : 'Prototype Engine'}
            </Badge>
          </div>

          <span className="text-xs font-medium text-slate-400">
            Workflow:{' '}
            <strong className="text-slate-700 dark:text-slate-200 capitalize">
              {currentState.toLowerCase()}
            </strong>
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Upload a practice take to generate real F0 pitch analysis, including median pitch,
          pitch range, stability, and voicing metrics.
        </p>
      </div>

      {/* STATE 1 — READY */}
      {currentState === WORKFLOW_STATES.READY && (
        <div className="space-y-6">
          {!selectedFile ? (
            <AudioDropzone
              onFileSelected={handleFileSelected}
              error={validationError}
              setError={setValidationError}
            />
          ) : (
            <SelectedFile
              file={selectedFile}
              onRemove={handleRemoveFile}
              onStartAnalysis={handleStartAnalysis}
            />
          )}

          {/* Error banner */}
          {analysisError && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
              <span className="text-amber-600 font-bold mt-0.5">⚠</span>
              <div>
                <span className="font-bold block">Notice</span>
                <p className="mt-0.5 text-amber-700">{analysisError}</p>
              </div>
            </div>
          )}

          {/* How It Works Card */}
          <Card className="bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80">
            <Card.Header className="py-3.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                How F0 Pitch Analysis Works
              </h2>
            </Card.Header>
            <Card.Content className="p-4 sm:p-5">
              <ol className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 list-decimal list-inside leading-relaxed">
                <li>Select a short audio recording from your practice session (max 10 MB).</li>
                <li>The backend decodes your audio and applies preprocessing (silence trimming, DC offset removal, normalization).</li>
                <li>The YIN algorithm extracts fundamental frequency (F0) across analysis frames.</li>
                <li>Derived metrics — median pitch, range, stability, and voicing ratio — are computed and returned.</li>
              </ol>
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                <span>Powered by backend F0 analysis</span>
                <span className="italic">Algorithm: YIN (de Cheveigné & Kawahara, 2002)</span>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

      {/* STATE 2 & 3 — UPLOADING / ANALYSING */}
      {(currentState === WORKFLOW_STATES.UPLOADING || currentState === WORKFLOW_STATES.ANALYSING) && (
        <div className="py-8">
          <AnalysisProgress
            fileName={selectedFile?.name}
            onComplete={() => setCurrentState(WORKFLOW_STATES.RESULTS)}
            phase={analysisPhase}
          />
        </div>
      )}

      {/* STATE 4 — RESULTS */}
      {currentState === WORKFLOW_STATES.RESULTS && analysisResults && (
        <AnalysisResults
          results={analysisResults}
          file={selectedFile}
          onReset={handleReset}
          isRealAnalysis={isRealAnalysis}
        />
      )}
    </div>
  );
}
