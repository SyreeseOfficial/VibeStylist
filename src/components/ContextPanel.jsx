import React from 'react';
import { useVibe } from '../context/VibeContext';
import GachaBox from './GachaBox';
import QuestWidget from './QuestWidget';
import WeatherWidget from './WeatherWidget';

const ContextPanel = ({ className = "" }) => {
    const { chatMessages } = useVibe();
    const isChatting = chatMessages.length > 0;

    if (isChatting) {
        return (
            <aside className={`border-l border-gray-800 p-6 bg-gray-900/30 overflow-y-auto flex flex-col ${className}`}>
                <h2 className="text-lg font-semibold mb-4 text-gray-200">Context</h2>

                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30 mb-4 animate-in fade-in">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-green-400 uppercase tracking-wider">Live Session</span>
                    </div>
                    <p className="text-sm text-gray-400">
                        The AI is analyzing your style and requests in real-time.
                    </p>
                </div>

                <div className="mt-auto">
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 opacity-50 hover:opacity-100 transition">
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Current Vibe</h3>
                        <p className="text-gray-200">Casual Chic</p>
                    </div>
                </div>
            </aside>
        );
    }

    return (
        <aside className={`border-l border-gray-800 p-6 bg-gray-900/30 overflow-y-auto ${className}`}>
            <h2 className="text-lg font-semibold mb-4 text-gray-200">Today's Vibe</h2>
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <WeatherWidget />
                <QuestWidget />
                <GachaBox />

                <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Current Vibe</h3>
                    <p className="text-gray-200">Casual Chic</p>
                </div>
            </div>
        </aside>
    );
};

export default ContextPanel;
