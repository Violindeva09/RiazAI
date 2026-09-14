import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Analyse from './pages/Analyse';
import Sessions from './pages/Sessions';
import Analytics from './pages/Analytics';
import GoalsPlaceholder from './pages/Goals';
import JournalPlaceholder from './pages/Journal';
import CoachPlaceholder from './pages/Coach';
import ProfilePlaceholder from './pages/Profile';
import SettingsPlaceholder from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analyse" element={<Analyse />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="goals" element={<GoalsPlaceholder />} />
          <Route path="journal" element={<JournalPlaceholder />} />
          <Route path="coach" element={<CoachPlaceholder />} />
          <Route path="profile" element={<ProfilePlaceholder />} />
          <Route path="settings" element={<SettingsPlaceholder />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;