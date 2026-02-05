import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../context/VibeContext';
import { ArrowRight, ArrowLeft, Check, User, Sliders, Save } from 'lucide-react';

const Onboarding = () => {
    const navigate = useNavigate();
    const { setUserProfile } = useVibe();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        fitPreference: 50, // 0: Tight, 100: Loose
        colorPalette: 50,  // 0: Neutral, 100: Vibrant
        utilityVsAesthetic: 50 // 0: Utility, 100: Aesthetic
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSave = () => {
        setUserProfile(prev => ({ ...prev, ...formData }));
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
                {/* Progress Bar */}
                <div className="bg-gray-700 h-2 w-full">
                    <div
                        className="bg-blue-600 h-full transition-all duration-300 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold mb-2">
                            {step === 1 && "Let's get to know you"}
                            {step === 2 && "Define your Vibe"}
                            {step === 3 && "Review & Save"}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Step {step} of 3
                        </p>
                    </div>

                    {/* Step 1: User Name */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    What should we call you?
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your name"
                                        className="w-full bg-gray-900 border border-gray-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Sliders */}
                    {step === 2 && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Fit Preference */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Tight Fit</span>
                                    <span className="font-medium text-white">Fit Preference</span>
                                    <span className="text-gray-400">Loose Fit</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.fitPreference}
                                    onChange={(e) => setFormData({ ...formData, fitPreference: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                                />
                            </div>

                            {/* Color Palette */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Neutral/Dark</span>
                                    <span className="font-medium text-white">Color Palette</span>
                                    <span className="text-gray-400">Vibrant/Bright</span>
                                </div>
                                <div className="relative w-full h-2 bg-gradient-to-r from-gray-700 via-gray-500 to-indigo-500 rounded-lg">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={formData.colorPalette}
                                        onChange={(e) => setFormData({ ...formData, colorPalette: parseInt(e.target.value) })}
                                        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div
                                        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-md pointer-events-none"
                                        style={{ left: `${formData.colorPalette}%` }}
                                    />
                                </div>
                            </div>

                            {/* Utility vs Aesthetic */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Pure Utility</span>
                                    <span className="font-medium text-white">Style Priority</span>
                                    <span className="text-gray-400">Pure Aesthetic</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.utilityVsAesthetic}
                                    onChange={(e) => setFormData({ ...formData, utilityVsAesthetic: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Summary */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700/50">
                                <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-4">Profile Summary</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                                        <span className="text-gray-400">Name</span>
                                        <span className="font-semibold">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                                        <span className="text-gray-400">Fit Preference</span>
                                        <span className="font-semibold">{formData.fitPreference}% Loose</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                                        <span className="text-gray-400">Color Vibe</span>
                                        <span className="font-semibold">{formData.colorPalette}% Vibrant</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Style Priority</span>
                                        <span className="font-semibold">{formData.utilityVsAesthetic}% Aesthetic</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-center text-gray-500">
                                You can update these preferences anytime in Settings.
                            </p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition flex items-center gap-2"
                            >
                                <ArrowLeft size={18} /> Back
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={step === 1 && !formData.name.trim()}
                                className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition flex items-center justify-center gap-2"
                            >
                                Next Step <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="flex-1 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition flex items-center justify-center gap-2"
                            >
                                <Check size={18} /> Complete Setup
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
