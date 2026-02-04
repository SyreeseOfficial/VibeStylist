import { useState, useEffect } from 'react';

// WMO Weather interpretation codes (WW)
const getWeatherLabel = (code) => {
    if (code === 0) return 'Clear Sky';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Fog';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 61 && code <= 65) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain Showers';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Unknown';
};

const useWeather = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    // Fetch from Open-Meteo
                    const response = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`
                    );

                    if (!response.ok) {
                        throw new Error('Failed to fetch weather data');
                    }

                    const data = await response.json();

                    setWeather({
                        temp: Math.round(data.current.temperature_2m),
                        humidity: data.current.relative_humidity_2m,
                        windSpeed: Math.round(data.current.wind_speed_10m),
                        condition: getWeatherLabel(data.current.weather_code),
                        code: data.current.weather_code
                    });
                    setLoading(false);
                } catch (err) {
                    setError('Failed to load weather');
                    setLoading(false);
                }
            },
            (err) => {
                setError('Location access denied');
                setLoading(false);
            }
        );
    }, []);

    return { weather, loading, error };
};

export default useWeather;
