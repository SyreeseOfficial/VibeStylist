import React, { useState, useEffect } from 'react';
import { Lightbulb, Shirt, CloudRain, Flame, Search, Sparkles } from 'lucide-react';

const STARTER_PROMPTS = [
    "Build a rainy day outfit.",
    "Roast my current rotation.",
    "Identify gaps in my wardrobe.",
    "Style a monochromatic look.",
    "What should I wear to a job interview?",
    "Create a date night outfit.",
    "I need a cozy weekend fit.",
    "Style my least worn item.",
    "Suggest an outfit for a summer wedding.",
    "How do I style oversized fits?",
    "Create a business casual look.",
    "What shoes go with wide-leg trousers?",
    "Give me an outfit based on 90s fashion.",
    "Help me layer for cold weather.",
    "Suggest a minimal aesthetic outfit.",
    "What colors look best on me?",
    "Build an outfit for a music festival.",
    "Style a denim-on-denim look.",
    "I need an outfit for hiking.",
    "Create a gym-to-brunch look."
];

const EmptyState = ({ onSelect }) => {
    const [prompts, setPrompts] = useState([]);

    useEffect(() => {
        // Randomly select 4 unique prompts
        const shuffled = [...STARTER_PROMPTS].sort(() => 0.5 - Math.random());
        setPrompts(shuffled.slice(0, 4));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-lg shadow-purple-900/20">
                    <Sparkles size={32} className="text-purple-300" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">VibeStylist AI</h2>
                <p className="text-slate-400 max-w-sm mx-auto">
                    Your personal AI stylist is ready. Ask for advice, critiques, or outfit ideas.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {prompts.map((prompt, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(prompt)}
                        className="group flex items-center gap-3 p-4 bg-gray-800/40 hover:bg-gray-800/80 border border-gray-700/50 hover:border-purple-500/30 rounded-xl transition-all duration-200 text-left hover:shadow-lg hover:shadow-purple-900/10 hover:-translate-y-0.5"
                    >
                        <div className="p-2 bg-gray-700/50 group-hover:bg-purple-500/20 rounded-lg transition-colors">
                            <Search size={16} className="text-gray-400 group-hover:text-purple-300" />
                        </div>
                        <span className="text-sm text-gray-200 group-hover:text-white font-medium">
                            {prompt}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmptyState;
