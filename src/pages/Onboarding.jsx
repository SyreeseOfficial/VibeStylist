import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../context/VibeContext';
import { ArrowRight, ArrowLeft, Check, User, Sliders, Save } from 'lucide-react';

const Onboarding = () => {
    const navigate = useNavigate();
    const { setUserProfile, setBudget } = useVibe();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        fitPreference: 50, // 0: Tight, 100: Loose
        colorPalette: 50,  // 0: Neutral, 100: Vibrant
        utilityVsAesthetic: 50, // 0: Utility, 100: Aesthetic
        budget: 0, // Default budget
        textures: [], // Multi-select
        accessoryVibe: 'Functional' // Single select
    });

    const TEXTURE_OPTIONS = ['Denim', 'Leather', 'Cotton', 'Tech/Synthetic', 'Wool', 'Silk/Satin'];
    const ACCESSORY_OPTIONS = [
        { id: 'Minimalist', label: 'Minimalist', desc: 'No clutter, just essentials.' },
        { id: 'Functional', label: 'Functional', desc: 'Watches, bags, belts.' },
        { id: 'Statement', label: 'Statement', desc: 'Jewelry, hats, scarves.' }
    ];

    const toggleTexture = (texture) => {
        setFormData(prev => {
            const current = prev.textures || [];
            if (current.includes(texture)) {
                return { ...prev, textures: current.filter(t => t !== texture) };
            } else {
                return { ...prev, textures: [...current, texture] };
            }
        });
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSave = () => {
        setUserProfile(prev => ({ ...prev, ...formData }));
        setBudget(parseFloat(formData.budget) || 0);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
                {/* Progress Bar */}
                <div className="bg-gray-700 h-2 w-full">
                    <div
                        className="bg-blue-600 h-full transition-all duration-300 ease-out"
                        style={{ width: `${(step / 5) * 100}%` }}
                    />
                </div>

                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold mb-2">
                            {step === 1 && "Let's get to know you"}
                            {step === 2 && "Define your Vibe"}
                            {step === 3 && "Fabric & Feel"}
                            {step === 4 && "Accessorize"}
                            {step === 5 && "Review & Save"}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Step {step} of 5
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

                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Monthly Clothing Budget ($)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    placeholder="e.g. 200"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Textures */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-lg font-medium text-white mb-4">Preferred Fabrics</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {TEXTURE_OPTIONS.map(texture => (
                                    <button
                                        key={texture}
                                        onClick={() => toggleTexture(texture)}
                                        className={`p-4 rounded-xl border transition text-left ${formData.textures?.includes(texture)
                                            ? 'bg-blue-600 border-blue-500 text-white'
                                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {texture}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Accessories */}
                    {step === 4 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-lg font-medium text-white mb-4">Accessory Style</h3>
                            <div className="space-y-3">
                                {ACCESSORY_OPTIONS.map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => setFormData({ ...formData, accessoryVibe: option.id })}
                                        className={`w-full p-4 rounded-xl border transition flex items-center justify-between ${formData.accessoryVibe === option.id
                                            ? 'bg-purple-600 border-purple-500 text-white'
                                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        <div className="text-left">
                                            <div className="font-semibold">{option.label}</div>
                                            <div className={`text-sm ${formData.accessoryVibe === option.id ? 'text-purple-200' : 'text-gray-400'}`}>
                                                {option.desc}
                                            </div>
                                        </div>
                                        {formData.accessoryVibe === option.id && <Check size={20} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 5: Summary */}
                    {step === 5 && (
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
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                                        <span className="text-gray-400">Style Priority</span>
                                        <span className="font-semibold">{formData.utilityVsAesthetic}% Aesthetic</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                                        <span className="text-gray-400">Fabrics</span>
                                        <span className="font-semibold text-right text-sm">{(formData.textures || []).join(', ') || 'None'}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                                        <span className="text-gray-400">Accessories</span>
                                        <span className="font-semibold">{formData.accessoryVibe}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Monthly Budget</span>
                                        <span className="font-semibold text-green-400">${formData.budget}</span>
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

                        {step < 5 ? (
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
