import React from 'react';
import { useVibe } from '../context/VibeContext';
import WardrobeAnalytics from '../components/WardrobeAnalytics';
import StyleRadar from '../components/StyleRadar';
import { BarChart3, ShoppingBag, Recycle, Sparkles, Lock } from 'lucide-react';

const StatsPage = () => {
    const { inventory, userProfile } = useVibe();

    // Achievement Logic
    const achievements = [
        {
            id: 'wardrobe_stuffer',
            title: 'Wardrobe Stuffer',
            description: 'Upload 10 items to your inventory.',
            icon: <ShoppingBag size={24} />,
            isUnlocked: inventory.length >= 10,
            color: 'text-blue-400',
            bg: 'bg-blue-400/20',
            border: 'border-blue-400/50'
        },
        {
            id: 'sustainable_style',
            title: 'Sustainable Style',
            description: 'Wear the same item 10 times.',
            icon: <Recycle size={24} />,
            isUnlocked: inventory.some(item => (item.wearCount || 0) >= 10),
            color: 'text-green-400',
            bg: 'bg-green-400/20',
            border: 'border-green-400/50'
        },
        {
            id: 'clean_freak',
            title: 'Clean Freak',
            description: 'Have all items marked as clean.',
            icon: <Sparkles size={24} />,
            isUnlocked: inventory.length > 0 && inventory.every(item => item.isClean),
            color: 'text-purple-400',
            bg: 'bg-purple-400/20',
            border: 'border-purple-400/50'
        }
    ];

    return (
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="text-purple-500" />
                Wardrobe Stats
            </h1>

            {/* Achievement Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((badge) => (
                    <div
                        key={badge.id}
                        className={`
                            relative p-4 rounded-xl border flex items-center gap-4 transition-all duration-300
                            ${badge.isUnlocked
                                ? `${badge.bg} ${badge.border} shadow-[0_0_15px_rgba(0,0,0,0.3)]`
                                : 'bg-gray-800/50 border-gray-700 grayscale opacity-60'
                            }
                        `}
                    >
                        <div className={`p-3 rounded-full ${badge.isUnlocked ? 'bg-black/20' : 'bg-gray-800'}`}>
                            {badge.isUnlocked ? (
                                <div className={badge.color}>{badge.icon}</div>
                            ) : (
                                <Lock size={24} className="text-gray-500" />
                            )}
                        </div>
                        <div>
                            <h3 className={`font-bold ${badge.isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                                {badge.title}
                            </h3>
                            <p className="text-xs text-gray-400">{badge.description}</p>
                        </div>
                        {badge.isUnlocked && (
                            <div className="absolute top-2 right-2">
                                <span className="flex h-2 w-2">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badge.color.replace('text-', 'bg-')}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${badge.color.replace('text-', 'bg-')}`}></span>
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <WardrobeAnalytics />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                    <StyleRadar />
                </div>
            </div>
        </div>
    );
};

export default StatsPage;
