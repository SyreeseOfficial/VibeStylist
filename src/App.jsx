import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import SettingsPage from './pages/SettingsPage';
import DashboardLayout from './components/DashboardLayout';
import Onboarding from './pages/Onboarding';
import { Home, Settings } from 'lucide-react';

import { useVibe } from './context/VibeContext';

const RequireProfile = ({ children }) => {
  const { userProfile } = useVibe();

  if (!userProfile?.name) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Routes>
          <Route path="/" element={
            <RequireProfile>
              <DashboardLayout />
            </RequireProfile>
          } />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
