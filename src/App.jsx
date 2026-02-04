import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SettingsPage from './pages/SettingsPage';
import DashboardLayout from './components/DashboardLayout';
import Onboarding from './pages/Onboarding';
import { Home, Settings } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Routes>
          <Route path="/" element={<DashboardLayout />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
