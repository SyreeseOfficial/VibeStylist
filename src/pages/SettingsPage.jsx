import React, { useState } from 'react';
import { useVibe } from '../context/VibeContext';
import { Save, Trash2, Key } from 'lucide-react';

const SettingsPage = () => {
    const { apiKey, setApiKey, clearData } = useVibe();
    const [inputKey, setInputKey] = useState(apiKey);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setApiKey(inputKey);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to wipe all data? This cannot be undone.')) {
            clearData();
            setInputKey('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="mt-2 text-slate-400">Manage your preferences and data.</p>
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
                                onChange={(e) => setInputKey(e.target.value)}
                                placeholder="Enter your API key"
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Your key is stored locally in your browser and used only for AI requests.
                        </p>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <Save size={18} />
                        {saved ? 'Saved!' : 'Save Key'}
                    </button>
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
