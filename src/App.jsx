import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SettingsPage from './pages/SettingsPage';
import { Home, Settings } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
              <span className="text-2xl">✨</span> VibeStylist
            </Link>
            <div className="flex gap-4">
              <Link to="/" className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition">
                <Home size={24} />
              </Link>
              <Link to="/settings" className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition">
                <Settings size={24} />
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={
              <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to VibeStylist</h1>
                <p className="text-gray-600">Your personal AI fashion assistant.</p>
                <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
                  <p className="text-gray-600 mb-4">
                    Head over to the <Link to="/settings" className="text-blue-600 hover:underline">Settings</Link> page to configure your API key.
                  </p>
                </div>
              </div>
            } />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
