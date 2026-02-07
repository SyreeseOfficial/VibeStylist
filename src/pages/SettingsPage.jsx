import React, { useState } from 'react';
import { useVibe } from '../context/VibeContext';
import { useNavigate } from 'react-router-dom';
import { Save, Trash2, Key, AlertCircle, Check, Loader2, ArrowLeft, MapPin, Download, RefreshCw, User, CloudSun, Volume2, VolumeX, Cpu } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import { testApiKeyConnection } from '../utils/aiService';
import { XP_REWARDS, GEMINI_MODELS } from '../utils/constants';

const SettingsPage = () => {
    const { apiKey, setApiKey, clearData, location, setLocation, userProfile, setUserProfile, aiModel, setAiModel } = useVibe();
    const [inputKey, setInputKey] = useState(apiKey);
    const [inputLocation, setInputLocation] = useState(location);
    const [selectedModel, setSelectedModel] = useState(aiModel || GEMINI_MODELS.FLASH);
    const [displayName, setDisplayName] = useState(userProfile?.displayName || userProfile?.name || '');
    const [persona, setPersona] = useState(userProfile?.customPersona || '');
    const [saved, setSaved] = useState(false);
    const [showWipeModal, setShowWipeModal] = useState(false);
    const navigate = useNavigate();

    // Testing State
    const [testing, setTesting] = useState(false);
    const [testSuccess, setTestSuccess] = useState(false);
    const [testError, setTestError] = useState(null);

    const handleSave = () => {
        const trimmedKey = inputKey.trim();
        setApiKey(trimmedKey);
        setInputKey(trimmedKey); // Update input to show trimmed version
        setLocation(inputLocation);
        setAiModel(selectedModel);

        // Award XP for updating profile (flat reward)
        setUserProfile(prev => ({
            ...prev,
            displayName: displayName, // Save display name
            customPersona: persona, // Save custom persona
            xp: (prev.xp || 0) + XP_REWARDS.UPDATE_PROFILE
        }));

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const testConnection = async () => {
        const trimmedKey = inputKey.trim();
        if (!trimmedKey) return;

        setTesting(true);
        setTestSuccess(false);
        setTestError(null);

        try {
            await testApiKeyConnection(trimmedKey, selectedModel);
            setTestSuccess(true);
        } catch (error) {
            setTestError(error.message);
        } finally {
            setTesting(false);
        }
    };

    const handleClear = () => {
        setShowWipeModal(true);
    };

    const handleExport = () => {
        const data = {
            userProfile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
            inventory: JSON.parse(localStorage.getItem('inventory') || '[]'),
            outfitLogs: JSON.parse(localStorage.getItem('outfitLogs') || '[]'),
            apiKey: JSON.parse(localStorage.getItem('apiKey') || '""'),
            location: JSON.parse(localStorage.getItem('location') || '""'),
            aiModel: JSON.parse(localStorage.getItem('aiModel') || `"${GEMINI_MODELS.FLASH}"`)
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

                        {/* AI Model Selection */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                <Cpu size={16} />
                                AI Model
                            </label>
                            <select
                                value={selectedModel}
                                onChange={(e) => {
                                    setSelectedModel(e.target.value);
                                    setTestSuccess(false);
                                    setTestError(null);
                                }}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                            >
                                <option value={GEMINI_MODELS.FLASH}>Gemini 1.5 Flash (Standard, Fast)</option>
                                <option value={GEMINI_MODELS.PRO}>Gemini 1.5 Pro (High Intelligence)</option>
                                <option value={GEMINI_MODELS.FLASH_2}>Gemini 2.0 Flash (Newest, Very Fast)</option>
                                <option value={GEMINI_MODELS.PRO_EXP}>Gemini 2.0 Pro Exp (Experimental, Smartest)</option>
                                <option value={GEMINI_MODELS.FLASH_LITE}>Gemini 2.0 Flash-Lite (Lightweight)</option>
                                <option value={GEMINI_MODELS.FLASH_8B}>Gemini 1.5 Flash-8B (Legacy)</option>
                            </select>
                            <p className="text-xs text-slate-500 mt-2">
                                "Flash" is recommended for speed. "Pro" provides higher quality but may have lower rate limits on free keys.
                            </p>
                        </div>

                        {/* Test Connection / Status Area */}
                        <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
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

                        {/* Display Name Section */}
                        <div className="pt-4 border-t border-slate-700">
                            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                <User size={16} />
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="What should the AI call you?"
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                The AI will use this name to address you.
                            </p>
                        </div>

                        {/* Persona Section */}
                        <div className="pt-4 border-t border-slate-700">
                            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                <span className="text-lg">🤖</span>
                                AI Stylist Persona
                            </label>
                            <textarea
                                value={persona}
                                onChange={(e) => setPersona(e.target.value)}
                                placeholder="E.g. 'Talk like a Californian surfer', 'Be extremely technical about fabrics', or leave empty for default."
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-h-[100px]"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Define the personality of your AI stylist. Leave blank to use the default friendly professional vibe.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <Save size={18} />
                        {saved ? `Saved! +${XP_REWARDS.UPDATE_PROFILE} XP` : 'Save Settings'}
                    </button>
                </div>

                {/* App & Data Section */}
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 space-y-4">
                    <h2 className="text-lg font-semibold text-white">App Preferences</h2>

                    <div className="space-y-3">
                        <button
                            onClick={() => setUserProfile(prev => ({ ...prev, sassMode: !prev.sassMode }))}
                            className={`w-full text-white font-medium py-3 px-4 rounded-lg flex items-center justify-between transition group ${userProfile?.sassMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                            <span className="flex items-center gap-3">
                                <span>{userProfile?.sassMode ? '🔥' : '😐'}</span>
                                Roast My Fit Mode
                            </span>
                            <span className="text-xs text-white/70">
                                {userProfile?.sassMode ? 'Enabled (Good luck)' : 'Disabled'}
                            </span>
                        </button>

                        <button
                            onClick={() => setUserProfile(prev => ({ ...prev, showWeather: !prev.showWeather }))}
                            className={`w-full text-white font-medium py-3 px-4 rounded-lg flex items-center justify-between transition ${userProfile?.showWeather !== false ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                            <span className="flex items-center gap-3">
                                <CloudSun size={18} />
                                Show Weather Widget
                            </span>
                            <span className="text-xs text-white/70">
                                {userProfile?.showWeather !== false ? 'On' : 'Off'}
                            </span>
                        </button>

                        <button
                            onClick={() => setUserProfile(prev => ({ ...prev, soundEffects: !prev.soundEffects }))}
                            className={`w-full text-white font-medium py-3 px-4 rounded-lg flex items-center justify-between transition ${userProfile?.soundEffects ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                            <span className="flex items-center gap-3">
                                {userProfile?.soundEffects ? <Volume2 size={18} /> : <VolumeX size={18} />}
                                Sound Effects
                            </span>
                            <span className="text-xs text-white/70">
                                {userProfile?.soundEffects ? 'On' : 'Off'}
                            </span>
                        </button>
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

            <ConfirmationModal
                isOpen={showWipeModal}
                title="Wipe All Data"
                message="Are you sure you want to wipe all data? This includes your profile, inventory, and outfit logs. This cannot be undone."
                onConfirm={() => {
                    clearData();
                    setInputKey('');
                    setShowWipeModal(false);
                }}
                onCancel={() => setShowWipeModal(false)}
                confirmText="Wipe Everything"
                isDanger={true}
            />
        </div>
    );
};

export default SettingsPage;
