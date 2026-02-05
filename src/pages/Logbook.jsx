import React from 'react';
import { useVibe } from '../context/VibeContext';
import { Calendar, Tag, Star, Award } from 'lucide-react';

const Logbook = () => {
    const { outfitLogs } = useVibe();

    if (outfitLogs.length === 0) {
        return (
            <div className="flex-1 p-8 h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <Calendar size={40} className="text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No outfits logged yet</h2>
                <p className="text-gray-400 max-w-md">
                    Start tracking your fits! When you log an outfit, it will appear here in your history.
                </p>
            </div>
        );
    }

    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Style Logbook</h1>
                <p className="text-gray-400 mt-1">Your outfit history and style evolution.</p>
            </header>

            <div className="space-y-6 max-w-4xl">
                {outfitLogs.map((log) => (
                    <div key={log.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:bg-gray-800/80 transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">
                                        {new Date(log.date).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {new Date(log.date).toLocaleTimeString(undefined, {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {log.vibeScore && (
                                    <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium flex items-center gap-2">
                                        <Star size={14} className="fill-purple-500/50" />
                                        Vibe Score: {log.vibeScore}
                                    </div>
                                )}
                                {log.questCompleted && (
                                    <div className="px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm font-medium flex items-center gap-2">
                                        <Award size={14} />
                                        Quest Complete
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Items Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {log.items && log.items.length > 0 ? (
                                log.items.map((item, index) => (
                                    <div key={`${log.id}-item-${index}`} className="group relative bg-gray-900 rounded-lg p-3 border border-gray-800 hover:border-gray-600 transition text-center">
                                        {item.category && (
                                            <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider text-gray-500 bg-gray-950/50 px-1.5 rounded">
                                                {item.category}
                                            </span>
                                        )}
                                        <div className="h-10 flex items-center justify-center mb-2 text-2xl group-hover:scale-110 transition-transform">
                                            {/* Placeholder emojis based on category if no image */}
                                            {item.category === 'Top' ? '👕' :
                                                item.category === 'Bottom' ? '👖' :
                                                    item.category === 'Shoes' ? '👟' : '🧢'}
                                        </div>
                                        <p className="text-sm font-medium text-gray-300 truncate w-full" title={item.name}>
                                            {item.name}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm italic col-span-full">No items recorded.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Logbook;
