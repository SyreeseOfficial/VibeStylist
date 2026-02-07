import React from 'react';
import { useVibe } from '../context/VibeContext';
import WardrobeAnalytics from '../components/WardrobeAnalytics';
import StyleRadar from '../components/StyleRadar';
import { BarChart3, ShoppingBag, Recycle, Sparkles, Lock, Moon, Sun, Calendar, DollarSign, Gem } from 'lucide-react';

const StatsPage = () => {
    const { inventory, userProfile, outfitLogs } = useVibe();

    // --- Stats Calculations ---
    const itemsWithPrice = inventory.filter(i => i.price > 0);

    // 1. Value Hunter (Avg CPW)
    const avgCPW = itemsWithPrice.length > 0
        ? itemsWithPrice.reduce((sum, item) => {
            const cpw = item.price / Math.max(1, item.wearCount || 0);
            return sum + cpw;
        }, 0) / itemsWithPrice.length
        : 0;

    // 2. Category Split
    const categoryCounts = inventory.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
    }, {});
    const totalItems = inventory.length || 1; // Avoid div by 0

    // 3. Most Expensive Category
    const categorySpend = inventory.reduce((acc, item) => {
        if (item.price) {
            acc[item.category] = (acc[item.category] || 0) + parseFloat(item.price);
        }
        return acc;
    }, {});

    // Sort categories by spendDesc for "Money Pit" chart or similar
    const sortedCategories = Object.entries(categorySpend).sort(([, a], [, b]) => b - a);

    // --- Achievement Logic ---
    // Helper for Weekend Warrior
    const weekendWarriorCount = React.useMemo(() => {
        const weekendLogs = outfitLogs.filter(log => {
            const d = new Date(log.date);
            return d.getDay() === 0 || d.getDay() === 6;
        });
        const distinctWeekends = new Set(weekendLogs.map(log => {
            const d = new Date(log.date);
            const sunday = new Date(d);
            sunday.setDate(d.getDate() - d.getDay());
            return sunday.toDateString();
        }));
        return distinctWeekends.size;
    }, [outfitLogs]);

    const achievements = [
        // Existing Badges
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
        },
        // New Badges
        {
            id: 'night_owl',
            title: 'Night Owl',
            description: 'Logged an outfit between 10 PM and 4 AM.',
            icon: <Moon size={24} />,
            isUnlocked: outfitLogs.some(log => {
                const hour = new Date(log.date).getHours();
                return hour >= 22 || hour < 4;
            }),
            color: 'text-indigo-400',
            bg: 'bg-indigo-400/20',
            border: 'border-indigo-400/50'
        },
        {
            id: 'early_bird',
            title: 'Early Bird',
            description: 'Logged an outfit before 7 AM.',
            icon: <Sun size={24} />,
            isUnlocked: outfitLogs.some(log => {
                const hour = new Date(log.date).getHours();
                return hour < 7 && hour >= 4; // Distinct from night owl (mostly)
            }),
            color: 'text-orange-400',
            bg: 'bg-orange-400/20',
            border: 'border-orange-400/50'
        },
        {
            id: 'weekend_warrior',
            title: 'Weekend Warrior',
            description: 'Logged outfits on 4 distinct weekends.',
            icon: <Calendar size={24} />,
            isUnlocked: weekendWarriorCount >= 4,
            color: 'text-pink-400',
            bg: 'bg-pink-400/20',
            border: 'border-pink-400/50'
        },
        {
            id: 'high_roller',
            title: 'High Roller',
            description: 'Added item > $500 or wore outfit > $1000.',
            icon: <DollarSign size={24} />,
            isUnlocked: inventory.some(i => parseFloat(i.price) > 500) || outfitLogs.some(log => {
                const outfitValue = log.items?.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0) || 0;
                return outfitValue > 1000;
            }),
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/20',
            border: 'border-yellow-400/50'
        },
        {
            id: 'accessory_addict',
            title: 'Accessory Addict',
            description: 'Have 5+ items in the "Accessory" category.',
            icon: <Gem size={24} />,
            isUnlocked: inventory.filter(i => i.category === 'Accessory').length >= 5,
            color: 'text-teal-400',
            bg: 'bg-teal-400/20',
            border: 'border-teal-400/50'
        }
    ];

    return (
        <div className="flex-1 p-6 overflow-y-auto space-y-8">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="text-purple-500" />
                Wardrobe Stats
            </h1>

            {/* Deep Dive Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Value Hunter */}
                <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                        <DollarSign size={80} />
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Value Hunter</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">${avgCPW.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">/ avg wear</span>
                    </div>
                    <div className="mt-4 w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(100, (avgCPW / 20) * 100)}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Target: Lower is better!</p>
                </div>

                {/* Category Split */}
                <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Category Split</h3>
                    <div className="space-y-3">
                        {['Top', 'Bottom', 'Shoes', 'Accessory'].map(cat => {
                            const count = categoryCounts[cat] || 0;
                            const pct = (count / totalItems) * 100;
                            return (
                                <div key={cat}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-300">{cat}</span>
                                        <span className="text-gray-500">{count} ({pct.toFixed(0)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${cat === 'Top' ? 'bg-blue-500' :
                                                cat === 'Bottom' ? 'bg-indigo-500' :
                                                    cat === 'Shoes' ? 'bg-pink-500' : 'bg-purple-500'
                                                }`}
                                            style={{ width: `${pct}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Money Pit (High Spend Categories) */}
                <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Money Pit</h3>
                    {itemsWithPrice.length > 0 ? (
                        <div className="space-y-4">
                            {sortedCategories.slice(0, 3).map(([cat, amount], idx) => (
                                <div key={cat} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-700 text-gray-400'}`}>
                                        #{idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="text-white text-sm font-medium">{cat}</span>
                                            <span className="text-gray-400 text-sm">${amount.toFixed(0)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 text-sm italic py-4">Add prices to items to see this!</div>
                    )}
                </div>
            </div>

            {/* Achievement Badges */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Badges & Milestones</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {achievements.map((badge) => (
                        <div
                            key={badge.id}
                            className={`
                                relative p-4 rounded-xl border flex flex-col gap-3 transition-all duration-300 h-full
                                ${badge.isUnlocked
                                    ? `${badge.bg} ${badge.border} shadow-lg`
                                    : 'bg-gray-800/30 border-gray-700/50 grayscale opacity-70 hover:opacity-100 hover:grayscale-0'
                                }
                            `}
                        >
                            <div className="flex items-start justify-between">
                                <div className={`p-2.5 rounded-lg ${badge.isUnlocked ? 'bg-black/20' : 'bg-gray-800'}`}>
                                    {badge.isUnlocked ? (
                                        <div className={badge.color}>{badge.icon}</div>
                                    ) : (
                                        <Lock size={20} className="text-gray-500" />
                                    )}
                                </div>
                                {badge.isUnlocked && (
                                    <span className={`inline-block w-2 H-2 rounded-full ${badge.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`}></span>
                                )}
                            </div>

                            <div>
                                <h3 className={`font-bold text-sm ${badge.isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                                    {badge.title}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{badge.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <WardrobeAnalytics />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                    <StyleRadar />
                </div>
            </div>
        </div>
    );
};

export default StatsPage;
