import React from 'react';
import { useVibe } from '../context/VibeContext';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

const WardrobeAnalytics = () => {
    const { inventory } = useVibe();

    // 1. Category Data for Pie Chart
    const categoryCounts = inventory.reduce((acc, item) => {
        const cat = item.category || 'Other';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const categoryData = Object.keys(categoryCounts).map(cat => ({
        name: cat,
        value: categoryCounts[cat]
    }));

    // 2. Most Worn Data for Bar Chart
    const mostWornData = [...inventory]
        .sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0))
        .slice(0, 5)
        .map(item => ({
            name: item.name,
            wears: item.wearCount || 0
        }));

    // 3. Clean vs Dirty for Gauge/Pie
    const cleanCount = inventory.filter(i => i.isClean).length;
    const dirtyCount = inventory.length - cleanCount;
    const cleanlinessData = [
        { name: 'Clean', value: cleanCount },
        { name: 'Dirty', value: dirtyCount }
    ];

    const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#6366f1'];
    const CLEAN_COLORS = ['#10b981', '#ef4444']; // Green for Clean, Red for Dirty

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl">
                    <p className="text-gray-200 font-medium">{`${label || payload[0].name}`}</p>
                    <p className="text-purple-400">
                        {payload[0].value !== undefined
                            ? `${payload[0].value} items`
                            : `${payload[0].value} wears`
                        }
                    </p>
                </div>
            );
        }
        return null;
    };

    if (inventory.length === 0) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Category Distribution */}
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">Wardrobe Composition</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Most Worn Items */}
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">Most Worn Rotation</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mostWornData} layout="vertical" margin={{ left: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={80}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl">
                                                <p className="text-gray-200 font-medium">{label}</p>
                                                <p className="text-blue-400">{payload[0].value} wears</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="wears" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Clean vs Dirty Gauge */}
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">Laundry Status</h3>
                <div className="h-64 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={cleanlinessData}
                                cx="50%"
                                cy="50%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {cleanlinessData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CLEAN_COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text for Gauge Feel */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:mt-8 mt-6 text-center">
                        <span className="block text-3xl font-bold text-white">
                            {Math.round((cleanCount / (inventory.length || 1)) * 100)}%
                        </span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Clean</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WardrobeAnalytics;
