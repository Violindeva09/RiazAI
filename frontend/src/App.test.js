import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

describe('Milestone 3 — Application Shell & Landing Page', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  test('renders the complete RiazAI landing page with all 9 key sections', () => {
    render(<App />);

    // 1. Navbar
    expect(screen.getByRole('navigation', { name: /Landing Page Navigation/i })).toBeInTheDocument();

    // 2. Hero headline and eyebrow
    expect(screen.getByText(/Personal Music Practice Intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/Practice with purpose\./i)).toBeInTheDocument();
    expect(screen.getByText(/Understand your progress\./i)).toBeInTheDocument();

    // 3. Problem section
    expect(screen.getByText(/Hours of practice\. Very little measurable feedback\./i)).toBeInTheDocument();
    expect(screen.getByText(/Vanished Practice History/i)).toBeInTheDocument();
    expect(screen.getByText(/Subjective Self-Evaluation/i)).toBeInTheDocument();
    expect(screen.getByText(/Consistency Blindspots/i)).toBeInTheDocument();
    expect(screen.getByText(/Disconnected Repetition/i)).toBeInTheDocument();

    // 4. Core Capabilities section with credibility
    expect(screen.getByText(/Built for deliberate, structured practice\./i)).toBeInTheDocument();
    expect(screen.getByText(/Audio-based practice analysis, performance metrics, and structured session feedback\./i)).toBeInTheDocument();
    expect(screen.getByText(/Current Prototype State/i)).toBeInTheDocument();
    expect(screen.getByText(/Future Product Roadmap/i)).toBeInTheDocument();

    // 5. How It Works (4 steps)
    expect(screen.getByText(/How RiazAI works\./i)).toBeInTheDocument();
    expect(screen.getByText(/Deliberate Practice Loop/i)).toBeInTheDocument();

    // 6. Dashboard Preview (Demonstration Data)
    expect(screen.getByText(/Designed for calm, focused musicians\./i)).toBeInTheDocument();
    expect(screen.getByText(/RiazAI Dashboard — riazai.app\/dashboard/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Performance Score/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Session Consistency/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Interactive product preview/i).length).toBeGreaterThanOrEqual(1);

    // 7. Long-term value / insight section (Session -> Trend -> Goal -> Improvement)
    expect(screen.getByText(/From isolated recordings to lifelong mastery\./i)).toBeInTheDocument();
    expect(screen.getByText(/Individual Riaz Recording/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Compounding Mastery/i).length).toBeGreaterThanOrEqual(1);

    // 8. Call to Action
    expect(screen.getByText(/Your practice deserves more than a recording\./i)).toBeInTheDocument();

    // 9. Footer
    expect(screen.getByText(/© 2026 RiazAI\. Built for dedicated musicians\./i)).toBeInTheDocument();
  });

  test('navigates through all 9 application routes and renders shell context', () => {
    const routes = [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/analyse', label: 'Analyse' },
      { path: '/sessions', label: 'Sessions' },
      { path: '/analytics', label: 'Analytics' },
      { path: '/goals', label: 'Goals' },
      { path: '/journal', label: 'Journal' },
      { path: '/coach', label: 'Coach' },
      { path: '/profile', label: 'Profile' },
      { path: '/settings', label: 'Settings' },
    ];

    routes.forEach(({ path, label }) => {
      window.history.pushState({}, label, path);
      const { unmount } = render(<App />);

      expect(screen.getAllByText(label).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByRole('navigation', { name: /Primary Navigation/i })).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: /Account Navigation/i })).toBeInTheDocument();

      unmount();
    });
  });

  test('mobile navigation drawer opens on menu click and closes on Escape key', () => {
    window.history.pushState({}, 'Dashboard', '/dashboard');
    render(<App />);

    const menuButton = screen.getByLabelText(/Open mobile navigation drawer/i);
    expect(menuButton).toBeInTheDocument();

    // Open drawer
    fireEvent.click(menuButton);
    expect(screen.getByRole('dialog', { name: /Mobile Navigation Drawer/i })).toBeInTheDocument();

    // Press Escape to close
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /Mobile Navigation Drawer/i })).not.toBeInTheDocument();
  });

  test('mobile navigation drawer closes when close button is clicked', () => {
    window.history.pushState({}, 'Dashboard', '/dashboard');
    render(<App />);

    const menuButton = screen.getByLabelText(/Open mobile navigation drawer/i);
    fireEvent.click(menuButton);

    const closeButton = screen.getByLabelText(/Close navigation/i);
    fireEvent.click(closeButton);

    expect(screen.queryByRole('dialog', { name: /Mobile Navigation Drawer/i })).not.toBeInTheDocument();
  });

  test('redirects unknown route to Landing page', () => {
    window.history.pushState({}, 'Unknown', '/random-unknown-path');
    render(<App />);

    expect(screen.getByText(/Personal Music Practice Intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/Practice with purpose\./i)).toBeInTheDocument();
  });
});

jest.mock('./services/api', () => ({
  uploadForAnalysis: jest.fn().mockResolvedValue({
    analysisVersion: 'heuristic-prototype-v1',
    source: 'demo',
    fallback: true,
    audio: { fileName: 'test.mp3', durationSeconds: 0, sampleRate: null, totalSamples: null },
    pitch: null,
    metrics: { overallScore: 86, pitchDisplay: null, stabilityPercentage: 84, voicingPercentage: 87 },
    processing: { processingTimeMs: 0 },
    feedback: 'Demonstration analysis — simulated heuristic metrics.',
    suggestedNextStep: 'Continue focusing on breath control.',
  }),
  ApiError: class ApiError extends Error {
    constructor(msg, status, details) { super(msg); this.status = status; this.details = details; }
  },
  isApiAvailable: jest.fn().mockResolvedValue(false),
  checkBackendHealth: jest.fn().mockResolvedValue(false),
}));

describe('Milestone 4 — Dashboard & Audio Analysis Experience', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('1. Dashboard renders the 4 main metric cards with demonstration indicators', () => {
    window.history.pushState({}, 'Dashboard', '/dashboard');
    render(<App />);

    expect(screen.getAllByText(/Performance Score/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Session Consistency/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Practice Time/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Practice Streak/i).length).toBeGreaterThanOrEqual(1);

    expect(screen.getAllByText('88%').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('84%').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('6.4 hrs').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('5 days').length).toBeGreaterThanOrEqual(1);
  });

  test('2. Dashboard renders weekly practice overview, progress trend, and recent sessions', () => {
    window.history.pushState({}, 'Dashboard', '/dashboard');
    render(<App />);

    expect(screen.getByText(/Weekly Practice Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Consistency Progress Trend/i)).toBeInTheDocument();
    expect(screen.getByText(/Demonstration progress data/i)).toBeInTheDocument();

    expect(screen.getByText(/Recent Sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/Morning Riaz — Sustained Notes Drill/i)).toBeInTheDocument();
    expect(screen.getByText(/Raga Yaman — Mandra Saptak Alap/i)).toBeInTheDocument();
    expect(screen.getByText(/Example Focus Area/i)).toBeInTheDocument();
    expect(screen.getByText(/Upper-register transition consistency/i)).toBeInTheDocument();
  });

  test('3. Analysis page starts in READY state with dropzone and 10 MB limit', () => {
    window.history.pushState({}, 'Analyse', '/analyse');
    render(<App />);

    expect(screen.getAllByText(/Audio Analysis/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Drag & drop your practice take here/i)).toBeInTheDocument();
    expect(screen.getAllByText(/10 MB/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/MP3, WAV, M4A, OGG, FLAC/i)).toBeInTheDocument();
  });

  test('4. Selecting a valid audio file updates the UI to show file details and analyse button', () => {
    window.history.pushState({}, 'Analyse', '/analyse');
    render(<App />);

    const fileInput = screen.getByLabelText(/Upload practice audio file/i);
    const validFile = new File(['fake-audio-binary-data'], 'take_alap_yaman.wav', { type: 'audio/wav' });

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    expect(screen.getByText('take_alap_yaman.wav')).toBeInTheDocument();
    expect(screen.getByText(/Analyse Recording/i)).toBeInTheDocument();
    expect(screen.getByText(/Remove File/i)).toBeInTheDocument();
  });

  test('5. Selecting an invalid file produces clear validation feedback', () => {
    window.history.pushState({}, 'Analyse', '/analyse');
    render(<App />);

    const fileInput = screen.getByLabelText(/Upload practice audio file/i);
    const invalidFile = new File(['text'], 'notes.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Validation error/i)).toBeInTheDocument();
    expect(screen.getByText(/Unsupported file format/i)).toBeInTheDocument();
  });

  test('6. Analysis demo transitions through progress to results, displays demonstration label, and resets', async () => {
    window.history.pushState({}, 'Analyse', '/analyse');
    render(<App />);

    const fileInput = screen.getByLabelText(/Upload practice audio file/i);
    const validFile = new File(['dummy-bytes'], 'riaz_session.mp3', { type: 'audio/mpeg' });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    // Click "Analyse Recording" -> triggers async flow
    const startBtn = screen.getByText(/Analyse Recording/i);
    fireEvent.click(startBtn);

    // Wait for mock API to resolve and results to render
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    // Verify RESULTS state (demo fallback shows)
    expect(screen.getByText(/Demonstration analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Save Session/i)).toBeInTheDocument();

    // Test Save Session
    const saveBtn = screen.getByText(/Save Session/i);
    fireEvent.click(saveBtn);
    expect(screen.getByText(/Session saved to local practice history!/i)).toBeInTheDocument();

    // Test "Analyse Another" resets workflow back to READY state
    const resetBtn = screen.getByText(/Analyse Another/i);
    fireEvent.click(resetBtn);

    expect(screen.getByText(/Drag & drop your practice take here/i)).toBeInTheDocument();
  });
});

describe('Milestone 5 — Sessions & Analytics', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('1. Sessions page renders header, summary metrics, and session cards', () => {
    window.history.pushState({}, 'Sessions', '/sessions');
    render(<App />);

    expect(screen.getByText(/Practice Sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/Your practice history/i)).toBeInTheDocument();

    // Summary metrics should render (demo sessions are loaded on first visit)
    expect(screen.getAllByText(/Total Sessions/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Practice Time/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Avg Score/i).length).toBeGreaterThanOrEqual(1);

    // Demo session cards should appear
    expect(screen.getByText(/Morning Riaz — Sustained Notes Drill/i)).toBeInTheDocument();
    expect(screen.getByText(/Raga Yaman — Mandra Saptak Alap/i)).toBeInTheDocument();
  });

  test('2. Saved audio analysis appears in Sessions history', async () => {
    window.history.pushState({}, 'Analyse', '/analyse');
    const { unmount } = render(<App />);

    const fileInput = screen.getByLabelText(/Upload practice audio file/i);
    const validFile = new File(['bytes'], 'morning_riaz.mp3', { type: 'audio/mpeg' });
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    fireEvent.click(screen.getByText(/Analyse Recording/i));

    // Wait for mock API to resolve and results to render
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    fireEvent.click(screen.getByText(/Save Session/i));
    unmount();

    // Now navigate to sessions and check the new session is listed
    window.history.pushState({}, 'Sessions', '/sessions');
    render(<App />);

    // Session title uses 'Riaz Take' prefix for demo sessions
    expect(screen.getByText(/Riaz Take — morning_riaz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Saved Take/i).length).toBeGreaterThanOrEqual(1);
  });

  test('3. Search and instrument filtering in Sessions works correctly', () => {
    window.history.pushState({}, 'Sessions', '/sessions');
    render(<App />);

    // Search by title
    const searchInput = screen.getByLabelText(/Search sessions/i);
    fireEvent.change(searchInput, { target: { value: 'Yaman' } });

    expect(screen.getByText(/Raga Yaman — Mandra Saptak Alap/i)).toBeInTheDocument();
    expect(screen.queryByText(/Morning Riaz — Sustained Notes Drill/i)).not.toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });

    // Filter by instrument
    const instrumentFilter = screen.getByLabelText(/Filter by instrument/i);
    fireEvent.change(instrumentFilter, { target: { value: 'Vocal' } });

    expect(screen.getByText(/Fast Taans & Articulation Drills/i)).toBeInTheDocument();
    expect(screen.queryByText(/Raga Yaman — Mandra Saptak Alap/i)).not.toBeInTheDocument();
  });

  test('4. Empty sessions state renders properly when session history is empty', () => {
    // Store an empty array to simulate cleared sessions
    localStorage.setItem('riazai_sessions', JSON.stringify([]));

    window.history.pushState({}, 'Sessions', '/sessions');
    render(<App />);

    expect(screen.getByText(/No practice sessions yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Your First Analysis/i)).toBeInTheDocument();
  });

  test('5. Session detail modal opens with take metrics and closes via Escape', () => {
    window.history.pushState({}, 'Sessions', '/sessions');
    render(<App />);

    // Click details on first session
    const detailButtons = screen.getAllByText(/Details/i);
    fireEvent.click(detailButtons[0]);

    // Modal should be open
    expect(screen.getByRole('dialog', { name: /Session Details/i })).toBeInTheDocument();
    expect(screen.getByText(/Performance Metrics/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Prototype metric/i).length).toBeGreaterThanOrEqual(1);

    // Close via Escape
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /Session Details/i })).not.toBeInTheDocument();
  });

  test('6. Analytics page derives overview metrics dynamically from sessions', () => {
    window.history.pushState({}, 'Analytics', '/analytics');
    render(<App />);

    expect(screen.getByText(/Progress Analytics/i)).toBeInTheDocument();

    // Overview metrics should exist and be derived from demo sessions
    expect(screen.getAllByText(/Total Sessions/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Practice Time/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Avg Score/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Avg Consistency/i).length).toBeGreaterThanOrEqual(1);

    // Charts and breakdown should render
    expect(screen.getByText(/Progress Trend/i)).toBeInTheDocument();
    expect(screen.getByText(/Practice Frequency/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance Breakdown/i)).toBeInTheDocument();

    // Highlights
    expect(screen.getByText(/Session Highlights/i)).toBeInTheDocument();
    expect(screen.getByText(/Strongest Session/i)).toBeInTheDocument();
    expect(screen.getByText(/Longest Session/i)).toBeInTheDocument();
  });

  test('7. Analytics page gracefully handles empty state (0 sessions)', () => {
    localStorage.setItem('riazai_sessions', JSON.stringify([]));

    window.history.pushState({}, 'Analytics', '/analytics');
    render(<App />);

    expect(screen.getByText(/No analytics data yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Analyse Your First Session/i)).toBeInTheDocument();
  });

  test('8. Deleting a session removes it from the list', () => {
    window.history.pushState({}, 'Sessions', '/sessions');
    render(<App />);

    // Verify the session exists
    expect(screen.getByText(/Morning Riaz — Sustained Notes Drill/i)).toBeInTheDocument();

    // Click Delete on first session
    const deleteButtons = screen.getAllByLabelText(/Delete session/i);
    fireEvent.click(deleteButtons[0]);

    // The session should be removed
    expect(screen.queryByText(/Morning Riaz — Sustained Notes Drill/i)).not.toBeInTheDocument();
  });

  test('9. Navigation between Dashboard, Sessions, Analytics, and Analyse is connected', () => {
    // Dashboard -> Sessions link exists
    window.history.pushState({}, 'Dashboard', '/dashboard');
    const { unmount: u1 } = render(<App />);
    expect(screen.getByText(/View All Sessions/i)).toBeInTheDocument();
    u1();

    // Sessions -> Analytics link exists
    window.history.pushState({}, 'Sessions', '/sessions');
    const { unmount: u2 } = render(<App />);
    expect(screen.getByText(/View Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Analyse Session/i)).toBeInTheDocument();
    u2();

    // Analytics -> Sessions and Analyse links exist
    window.history.pushState({}, 'Analytics', '/analytics');
    const { unmount: u3 } = render(<App />);
    expect(screen.getByText(/View Sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/New Analysis/i)).toBeInTheDocument();
    u3();
  });
});
