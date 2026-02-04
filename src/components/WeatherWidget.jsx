import React from 'react';
import { CloudRain, Wind } from 'lucide-react';

const WeatherWidget = () => {
    return (
        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-700/50 rounded-xl p-4 text-white relative overflow-hidden">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-widest">Seattle</h3>
                    <div className="text-3xl font-bold mt-1">52°F</div>
                    <div className="text-sm text-gray-300 flex items-center gap-1 mt-1">
                        <CloudRain size={14} /> Rain Showers
                    </div>
                </div>
                <div className="bg-blue-600/30 p-2 rounded-lg">
                    <CloudRain size={24} className="text-blue-300" />
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-blue-800/50 flex gap-4 text-xs text-blue-200">
                <div className="flex items-center gap-1">
                    <Wind size={12} />
                    <span>8 mph</span>
                </div>
                <div>
                    Humidity: 82%
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
