import { useState, useRef } from 'react';
import {
  ACCEPTED_AUDIO_STRING,
  SUPPORTED_FORMATS_TEXT,
  MAX_AUDIO_FILE_SIZE_MB,
  validateAudioFile,
} from '../../config/audioConfig';

export default function AudioDropzone({ onFileSelected, error, setError }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    const validation = validateAudioFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setError(null);
    onFileSelected(file);
  };

  const triggerBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Accessible Drag & Drop Target */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerBrowse}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerBrowse();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Upload audio practice recording dropzone. Click or drag audio file here."
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
          isDragOver
            ? 'border-primary-500 bg-primary-50/80 dark:bg-primary-900/30 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/60 hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_AUDIO_STRING}
          onChange={handleInputChange}
          className="sr-only"
          id="audio-file-input"
          aria-label="Upload practice audio file"
        />

        <div className="max-w-md mx-auto space-y-4 pointer-events-none">
          {/* Audio upload cloud/waveform icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-xs flex items-center justify-center text-primary-600 dark:text-primary-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <div>
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Drag & drop your practice take here
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              or <span className="text-primary-600 font-semibold underline underline-offset-2">browse files</span> on your computer
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-600/80 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
            <span>Supported: <strong className="text-slate-600 dark:text-slate-300 font-medium">{SUPPORTED_FORMATS_TEXT}</strong></span>
            <span>•</span>
            <span>Max size: <strong className="text-slate-600 dark:text-slate-300 font-medium">{MAX_AUDIO_FILE_SIZE_MB} MB</strong></span>
          </div>
        </div>
      </div>

      {/* Validation Error Banner */}
      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-200"
        >
          <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <span className="font-bold block">Validation error</span>
            <p className="mt-0.5 text-rose-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
