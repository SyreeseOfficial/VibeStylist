import React from 'react';
import { useVibe } from '../context/VibeContext';
import { Target, CheckCircle, Zap } from 'lucide-react';

const QuestWidget = () => {
    const { dailyQuest, completeQuest } = useVibe();

    return (
        <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-700/50 rounded-xl p-4 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl group-hover:bg-yellow-500/20 transition duration-500"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Target size={18} className="text-yellow-500" />
                    <h3 className="text-sm font-bold text-yellow-100 uppercase tracking-wide">Daily Quest</h3>
                </div>

                <p className="text-white font-medium text-lg leading-tight mb-4">
                    {dailyQuest.text}
                </p>

                {dailyQuest.isCompleted ? (
                    <div className="flex items-center gap-2 text-green-400 bg-green-900/30 px-3 py-2 rounded-lg border border-green-700/50 w-full justify-center">
                        <CheckCircle size={18} />
                        <span className="font-semibold text-sm">Completed</span>
                    </div>
                ) : (
                    <button
                        onClick={completeQuest}
                        className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 rounded-lg transition-all shadow-lg hover:shadow-yellow-600/20 flex items-center justify-center gap-2"
                    >
                        <span>Complete</span>
                        <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded text-xs">
                            <Zap size={10} className="fill-current" />
                            <span>+150 XP</span>
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuestWidget;
