import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useVibe } from '../context/VibeContext';
import { ArrowRight, ArrowLeft, Check, User, Sliders, Save, AlertTriangle, Download, X } from 'lucide-react';
import { SAMPLE_INVENTORY, SAMPLE_WISHLIST } from '../utils/sampleData';
import { toast } from 'sonner';

const Onboarding = () => {
    const navigate = useNavigate();

    const { userProfile, setUserProfile, setBudget, setInventory, setWishlist } = useVibe();
    const [step, setStep] = useState(1);
    const [isCompleting, setIsCompleting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        fitPreference: 50, // 0: Tight, 100: Loose
        colorPalette: 50,  // 0: Neutral, 100: Vibrant
        utilityVsAesthetic: 50, // 0: Utility, 100: Aesthetic
        budget: 0, // Default budget
        textures: [], // Multi-select
        accessoryVibe: 'Functional', // Single select
        lifestyle: 'Casual', // New Step 5
        climate: 'Neutral', // New Step 6
        bodyType: 'Average', // New Step 8
        styleEras: [], // Multi-select, New Step 9
        fashionDislikes: [] // Multi-select, New Step 10
    });

    const TEXTURE_OPTIONS = ['Denim', 'Leather', 'Cotton', 'Tech/Synthetic', 'Wool', 'Silk/Satin'];
    const ACCESSORY_OPTIONS = [
        { id: 'Minimalist', label: 'Minimalist', desc: 'No clutter, just essentials.' },
        { id: 'Functional', label: 'Functional', desc: 'Watches, bags, belts.' },
        { id: 'Statement', label: 'Statement', desc: 'Jewelry, hats, scarves.' }
    ];
    const LIFESTYLE_OPTIONS = [
        { id: 'Casual', label: 'Casual', desc: 'Relaxed, everyday comfort.' },
        { id: 'Work', label: 'Work / Professional', desc: 'Sharp, clean, business-ready.' },
        { id: 'Active', label: 'Active', desc: 'Gym to street, always moving.' },
        { id: 'Party', label: 'Party / Social', desc: 'Bold looks for nights out.' }
    ];
    const CLIMATE_OPTIONS = [
        { id: 'Always Cold', label: 'Always Cold', desc: 'Layer me up, buttercup.' },
        { id: 'Neutral', label: 'Neutral', desc: 'I adapt to the seasons.' },
        { id: 'Always Hot', label: 'Always Hot', desc: 'Less is more. Breathable fabrics.' }
    ];
    const BODY_TYPE_OPTIONS = ['Petite', 'Tall', 'Curvy', 'Athletic', 'Broad Shoulders', 'Narrow Hips', 'Average'];
    const STYLE_ERA_OPTIONS = ['90s Grunge', 'Y2K', '70s Boho', '80s Power', 'Old Money', 'Streetwear', 'Modern Minimalist'];
    const DISLIKE_OPTIONS = ['Crop Tops', 'High Heels', 'Skinny Jeans', 'Polyester', 'Bright Colors', 'Logos', 'Wool'];

    const toggleMultiSelect = (field, value) => {
        setFormData(prev => {
            const current = prev[field] || [];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(t => t !== value) };
            } else {
                return { ...prev, [field]: [...current, value] };
            }
        });
    };

    const toggleTexture = (texture) => toggleMultiSelect('textures', texture);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSave = () => {
        setIsCompleting(true);
        setUserProfile(prev => ({ ...prev, ...formData }));
        setBudget(parseFloat(formData.budget) || 0);
        // Navigation will happen in useEffect once profile is updated
    };

    const handleLoadSampleData = () => {
        setInventory(SAMPLE_INVENTORY);
        setWishlist(SAMPLE_WISHLIST);
        toast.success("Sample wardrobe & wishlist loaded!");
        handleNext(); // Auto advance to review
    };

    React.useEffect(() => {
        if (isCompleting && userProfile?.name) {
            navigate('/');
        }
    }, [userProfile, isCompleting, navigate]);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
                {/* Progress Bar */}
                <div className="bg-gray-700 h-2 w-full">
                    <div
                        className="bg-blue-600 h-full transition-all duration-300 ease-out"
                        style={{ width: `${(step / 11) * 100}%` }}
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
                            {step === 5 && "Lifestyle"}
                            {step === 6 && "Climate Check"}
                            {step === 7 && "Body Type"}
                            {step === 8 && "Viral Eras"}
                            {step === 9 && "Dealbreakers"}
                            {step === 10 && "Quick Start"}
                            {step === 11 && "Review & Save"}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Step {step} of 11
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

                    {/* Step 5: Lifestyle */}
                    {step === 5 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-lg font-medium text-white mb-4">Primary Vibe</h3>
                            <div className="space-y-3">
                                {LIFESTYLE_OPTIONS.map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => setFormData({ ...formData, lifestyle: option.id })}
                                        className={`w-full p-4 rounded-xl border transition flex items-center justify-between ${formData.lifestyle === option.id
                                            ? 'bg-indigo-600 border-indigo-500 text-white'
                                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        <div className="text-left">
                                            <div className="font-semibold">{option.label}</div>
                                            <div className={`text-sm ${formData.lifestyle === option.id ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                {option.desc}
                                            </div>
                                        </div>
                                        {formData.lifestyle === option.id && <Check size={20} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 6: Climate */}
                    {step === 6 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-lg font-medium text-white mb-4">Temperature Preference</h3>
                            <div className="space-y-3">
                                {CLIMATE_OPTIONS.map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => setFormData({ ...formData, climate: option.id })}
                                        className={`w-full p-4 rounded-xl border transition flex items-center justify-between ${formData.climate === option.id
                                            ? 'bg-orange-600 border-orange-500 text-white'
                                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        <div className="text-left">
                                            <div className="font-semibold">{option.label}</div>
                                            <div className={`text-sm ${formData.climate === option.id ? 'text-orange-200' : 'text-gray-400'}`}>
                                                {option.desc}
                                            </div>
                                        </div>
                                        {formData.climate === option.id && <Check size={20} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 7 -> 10: Summary was previously 7 */}

                    {/* Step 7: Body Type */}
                    {step === 7 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-lg font-medium text-white mb-4">How would you describe your build?</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {BODY_TYPE_OPTIONS.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData({ ...formData, bodyType: type })}
                                        className={`p-3 rounded-lg border transition text-center ${formData.bodyType === type
                                            ? 'bg-blue-600 border-blue-500 text-white'
                                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 8: Eras */}
                    {step === 8 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-lg font-medium text-white mb-4">Vibe Check: Favorite Eras/Styles</h3>
                            <div className="flex flex-wrap gap-2">
                                {STYLE_ERA_OPTIONS.map(era => (
                                    <button
                                        key={era}
                                        onClick={() => toggleMultiSelect('styleEras', era)}
                                        className={`px-4 py-2 rounded-full border transition text-sm ${formData.styleEras?.includes(era)
                                            ? 'bg-pink-600 border-pink-500 text-white'
                                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {era}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 9: Dislikes */}
                    {step === 9 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-lg font-medium text-white mb-4">Fashion Dealbreakers (I will never wear...)</h3>
                            <div className="flex flex-wrap gap-2">
                                {DISLIKE_OPTIONS.map(item => (
                                    <button
                                        key={item}
                                        onClick={() => toggleMultiSelect('fashionDislikes', item)}
                                        className={`px-4 py-2 rounded-full border transition text-sm ${formData.fashionDislikes?.includes(item)
                                            ? 'bg-red-600 border-red-500 text-white'
                                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}



                    {/* Step 10: Sample Data Load */}
                    {step === 10 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
                                <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Download size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Load Sample Wardrobe?</h3>
                                <p className="text-gray-300 mb-6">
                                    Don't want to enter your clothes manually right now?
                                    <br /><br />
                                    We can load a <strong>pre-filled wardrobe</strong> (tops, bottoms, shoes) so you can test the AI styling features immediately. You can delete these items later.
                                </p>

                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={handleLoadSampleData}
                                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition flex items-center justify-center gap-2"
                                    >
                                        <Download size={20} /> Yes, Load Sample Data
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium text-gray-300 transition"
                                    >
                                        No, I'll add my own
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 11: Summary */}
                    {step === 11 && (
                        <div className="space-y-6 animate-fadeIn">
                            {/* Work in Progress Warning */}
                            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 flex gap-3 text-yellow-200">
                                <AlertTriangle className="shrink-0 text-yellow-500" />
                                <div className="text-sm">
                                    <h4 className="font-bold mb-1">Work in Progress</h4>
                                    <p className="opacity-90">
                                        This project is currently under active development. Some features (like API keys and chat) are experimental.
                                        Feel free to explore and mess around!
                                    </p>
                                </div>
                            </div>

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
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                                        <span className="text-gray-400">Lifestyle</span>
                                        <span className="font-semibold">{formData.lifestyle}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                                        <span className="text-gray-400">Climate</span>
                                        <span className="font-semibold">{formData.climate}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                                        <span className="text-gray-400">Body Type</span>
                                        <span className="font-semibold">{formData.bodyType}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                                        <span className="text-gray-400">Favorite Eras</span>
                                        <span className="font-semibold text-right text-xs">{(formData.styleEras || []).join(', ') || 'None'}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                                        <span className="text-gray-400">Dislikes</span>
                                        <span className="font-semibold text-right text-xs text-red-400">{(formData.fashionDislikes || []).join(', ') || 'None'}</span>
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

                        {step < 11 ? (
                            step !== 10 && (
                                <button
                                    onClick={handleNext}
                                    disabled={step === 1 && !formData.name.trim()}
                                    className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition flex items-center justify-center gap-2"
                                >
                                    Next Step <ArrowRight size={18} />
                                </button>
                            )
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
