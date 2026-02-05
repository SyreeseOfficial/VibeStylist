import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const StyleRadar = () => {
    // Hardcoded values for now
    const data = [
        { subject: 'Utility', A: 85, fullMark: 100 },
        { subject: 'Formal', A: 45, fullMark: 100 },
        { subject: 'Comfort', A: 90, fullMark: 100 },
        { subject: 'Tech', A: 75, fullMark: 100 },
    ];

    return (
        <div className="w-full h-48 mt-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 text-center">Style Profile</h3>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="My Style"
                        dataKey="A"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        fill="#8B5CF6"
                        fillOpacity={0.3}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StyleRadar;
