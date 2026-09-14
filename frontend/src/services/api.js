/**
 * API service layer for RiazAI backend communication.
 *
 * Responsibilities:
 * - Backend base URL configuration
 * - POST /api/analyse (multipart audio upload)
 * - Request timeout handling
 * - Error normalization
 *
 * Uses REACT_APP_API_BASE_URL environment variable.
 * Falls back to http://localhost:8080 for local development.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds

/**
 * Normalized API error.
 */
export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Upload an audio file for F0 analysis.
 *
 * @param {File} file - Audio file to upload
 * @param {Object} options - Optional configuration
 * @param {number} options.timeoutMs - Request timeout in milliseconds
 * @returns {Promise<Object>} Analysis response from backend
 * @throws {ApiError} On API errors
 */
export async function uploadForAnalysis(file, options = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  if (!file) {
    throw new ApiError('No file provided', 400, null);
  }

  const formData = new FormData();
  formData.append('audioFile', file);

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyse`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new ApiError(
        errorBody?.feedback || `Server error (${response.status})`,
        response.status,
        errorBody
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      throw new ApiError(
        'Analysis timed out. The server may be temporarily unavailable.',
        408,
        null
      );
    }

    if (err instanceof ApiError) {
      throw err;
    }

    // Network error or server unavailable
    throw new ApiError(
      'Unable to connect to the analysis server. Falling back to demo mode.',
      0,
      null
    );
  }
}

/**
 * Health check to verify backend availability.
 *
 * @returns {Promise<boolean>} Whether the backend is reachable
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Check if the API is available for real analysis.
 * Returns true if backend is reachable, false otherwise.
 *
 * @returns {Promise<boolean>}
 */
export async function isApiAvailable() {
  return checkBackendHealth();
}

export { API_BASE_URL };
