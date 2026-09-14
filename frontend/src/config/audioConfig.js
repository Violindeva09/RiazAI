export const MAX_AUDIO_FILE_SIZE_MB = 10;
export const MAX_AUDIO_FILE_SIZE_BYTES = MAX_AUDIO_FILE_SIZE_MB * 1024 * 1024;

export const ACCEPTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/x-m4a',
  'audio/ogg',
  'audio/flac',
];

export const ACCEPTED_AUDIO_EXTENSIONS = [
  '.mp3',
  '.wav',
  '.m4a',
  '.ogg',
  '.flac',
];

export const ACCEPTED_AUDIO_STRING = ACCEPTED_AUDIO_EXTENSIONS.join(',');
export const SUPPORTED_FORMATS_TEXT = 'MP3, WAV, M4A, OGG, FLAC';

export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function validateAudioFile(file) {
  if (!file) {
    return { valid: false, error: 'No audio file selected. Please choose a recording.' };
  }

  // Check file size (10 MB contract)
  if (file.size > MAX_AUDIO_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds the ${MAX_AUDIO_FILE_SIZE_MB} MB limit. Please select a shorter take or compress the audio.`,
    };
  }

  // Check extension
  const fileName = file.name || '';
  const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  const hasValidExtension = ACCEPTED_AUDIO_EXTENSIONS.includes(extension);

  // Check MIME type if present
  const hasValidMime = file.type ? ACCEPTED_AUDIO_TYPES.includes(file.type) || file.type.startsWith('audio/') : true;

  if (!hasValidExtension && !hasValidMime) {
    return {
      valid: false,
      error: `Unsupported file format (${extension || 'unknown'}). Supported formats: ${SUPPORTED_FORMATS_TEXT}.`,
    };
  }

  return { valid: true, error: null };
}

export const AUDIO_CONTRACT = {
  maxFileSizeMb: MAX_AUDIO_FILE_SIZE_MB,
  maxFileSizeBytes: MAX_AUDIO_FILE_SIZE_BYTES,
  acceptedMimeTypes: ACCEPTED_AUDIO_TYPES,
  acceptedExtensions: ACCEPTED_AUDIO_EXTENSIONS,
  supportedFormatsText: SUPPORTED_FORMATS_TEXT,
};
