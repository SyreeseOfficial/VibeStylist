import React from 'react';
import { CloudRain, Wind, Sun, Cloud, CloudFog, CloudLightning, Snowflake, CloudDrizzle, Loader2, MapPinOff } from 'lucide-react';
import useWeather from '../hooks/useWeather';

const WeatherWidget = () => {
    const { weather, loading, error } = useWeather();

    const getIcon = (code) => {
        if (code === 0) return <Sun size={24} className="text-yellow-400" />;
        if (code >= 1 && code <= 3) return <Cloud size={24} className="text-gray-300" />;
        if (code >= 45 && code <= 48) return <CloudFog size={24} className="text-gray-400" />;
        if (code >= 51 && code <= 55) return <CloudDrizzle size={24} className="text-blue-300" />;
        if (code >= 61 && code <= 65) return <CloudRain size={24} className="text-blue-400" />;
        if (code >= 71 && code <= 77) return <Snowflake size={24} className="text-white" />;
        if (code >= 80 && code <= 82) return <CloudRain size={24} className="text-blue-400" />;
        if (code >= 95 && code <= 99) return <CloudLightning size={24} className="text-yellow-400" />;
        return <Cloud size={24} className="text-gray-300" />;
    };

    if (loading) {
        return (
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 min-h-[120px] flex items-center justify-center">
                <Loader2 size={24} className="text-blue-400 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 min-h-[120px] flex flex-col items-center justify-center text-center">
                <MapPinOff size={24} className="text-red-400 mb-2" />
                <p className="text-xs text-red-300">{error}</p>
                <p className="text-[10px] text-red-400/70 mt-1">Check Permissions</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-700/50 rounded-xl p-4 text-white relative overflow-hidden min-h-[120px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-widest">Current Location</h3>
                    <div className="text-3xl font-bold mt-1">{weather.temp}°F</div>
                    <div className="text-sm text-gray-300 flex items-center gap-1 mt-1">
                        {getIcon(weather.code)} <span className="ml-1">{weather.condition}</span>
                    </div>
                </div>
                <div className="bg-blue-600/30 p-2 rounded-lg">
                    {getIcon(weather.code)}
                </div>
            </div>

            <div className="pt-2 border-t border-blue-800/50 flex gap-4 text-xs text-blue-200">
                <div className="flex items-center gap-1">
                    <Wind size={12} />
                    <span>{weather.windSpeed} mph</span>
                </div>
                <div>
                    Humidity: {weather.humidity}%
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
