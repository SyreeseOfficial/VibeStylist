import React, { useState } from 'react';
import { useVibe } from '../context/VibeContext';
import { useNavigate } from 'react-router-dom';
import { Save, Trash2, Key, AlertCircle, Check, Loader2, ArrowLeft, MapPin, Download, RefreshCw } from 'lucide-react';

const SettingsPage = () => {
    const { apiKey, setApiKey, clearData, location, setLocation } = useVibe();
    const [inputKey, setInputKey] = useState(apiKey);
    const [inputLocation, setInputLocation] = useState(location);
    const [saved, setSaved] = useState(false);
    const navigate = useNavigate();

    // Testing State
    const [testing, setTesting] = useState(false);
    const [testSuccess, setTestSuccess] = useState(false);
    const [testError, setTestError] = useState(null);

    const handleSave = () => {
        setApiKey(inputKey);
        setLocation(inputLocation);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const testConnection = async () => {
        if (!inputKey) return;

        setTesting(true);
        setTestSuccess(false);
        setTestError(null);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${inputKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: "Hello" }]
                    }]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || `Error: ${response.status} ${response.statusText}`);
            }

            setTestSuccess(true);
        } catch (error) {
            setTestError(error.message);
        } finally {
            setTesting(false);
        }
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to wipe all data? This cannot be undone.')) {
            clearData();
            setInputKey('');
        }
    };

    const handleExport = () => {
        const data = {
            userProfile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
            inventory: JSON.parse(localStorage.getItem('inventory') || '[]'),
            outfitLogs: JSON.parse(localStorage.getItem('outfitLogs') || '[]'),
            apiKey: JSON.parse(localStorage.getItem('apiKey') || '""'),
            location: JSON.parse(localStorage.getItem('location') || '""')
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vibestylist-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
            <div className="w-full max-w-md space-y-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-white"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                        <p className="mt-1 text-slate-400">Manage your preferences and data.</p>
                    </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 space-y-6">
                    {/* API Key Section */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                            <Key size={16} />
                            Google Gemini API Key
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={inputKey}
                                onChange={(e) => {
                                    setInputKey(e.target.value);
                                    setTestSuccess(false);
                                    setTestError(null);
                                }}
                                placeholder="Enter your API key"
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                        {/* Test Connection / Status Area */}
                        <div className="mt-3 flex items-center justify-between">
                            <button
                                onClick={testConnection}
                                disabled={testing || !inputKey}
                                className="text-sm bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white py-1 px-3 rounded transition flex items-center gap-2"
                            >
                                {testing && <Loader2 size={14} className="animate-spin" />}
                                Test Connection
                            </button>

                            {/* Status Indicators */}
                            <div className="flex-1 flex justify-end">
                                {testSuccess && (
                                    <span className="text-green-400 text-sm flex items-center gap-1">
                                        <Check size={14} /> Connected
                                    </span>
                                )}
                                {testError && (
                                    <span className="text-red-400 text-xs flex items-center gap-1 text-right" title={testError}>
                                        <AlertCircle size={14} className="shrink-0" />
                                        <span className="truncate max-w-[150px]">{testError}</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-slate-500 mt-2">
                            Your key is stored locally in your browser and used only for AI requests.
                        </p>
                        {/* Location Section */}
                        <div className="pt-4 border-t border-slate-700">
                            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                <MapPin size={16} />
                                Weather Location
                            </label>
                            <input
                                type="text"
                                value={inputLocation}
                                onChange={(e) => setInputLocation(e.target.value)}
                                placeholder="City or Zip Code (e.g. New York, 90210)"
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Leave blank to use automatic browser geolocation.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <Save size={18} />
                        {saved ? 'Saved!' : 'Save Key'}
                    </button>
                </div>

                {/* App & Data Section */}
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 space-y-4">
                    <h2 className="text-lg font-semibold text-white">App Preferences</h2>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/onboarding')}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-between transition group"
                        >
                            <span className="flex items-center gap-3">
                                <RefreshCw size={18} className="text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
                                Redo Style Interview
                            </span>
                            <span className="text-xs text-slate-400">Update your vibe profile</span>
                        </button>

                        <button
                            onClick={handleExport}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-between transition"
                        >
                            <span className="flex items-center gap-3">
                                <Download size={18} className="text-green-400" />
                                Export Data Backup
                            </span>
                            <span className="text-xs text-slate-400">Download JSON</span>
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-900/20 p-6 rounded-xl border border-red-900/50 space-y-4">
                    <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
                    <p className="text-sm text-red-200/70">
                        Clear all stored data including your profile, inventory, and outfit logs.
                    </p>
                    <button
                        onClick={handleClear}
                        className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/30 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <Trash2 size={18} />
                        Clear All Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
