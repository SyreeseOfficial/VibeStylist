import React from 'react';
import { Toaster } from 'sonner';
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

import DashboardHome from './pages/DashboardHome';
import InventoryPage from './pages/InventoryPage';
import Logbook from './pages/Logbook';

// ... (RequireProfile remains same)

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Routes>
          <Route path="/" element={
            <RequireProfile>
              <DashboardLayout />
            </RequireProfile>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="logbook" element={<Logbook />} />
          </Route>
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
        <Toaster position="top-right" theme="dark" />
      </div>
    </BrowserRouter>
  );
}

export default App;
