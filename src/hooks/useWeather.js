import { useState, useEffect } from 'react';
import { useVibe } from '../context/VibeContext';

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
    const { location } = useVibe();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchWeather = async (lat, lon) => {
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }

                const data = await response.json();

                if (isMounted) {
                    setWeather({
                        temp: Math.round(data.current.temperature_2m),
                        humidity: data.current.relative_humidity_2m,
                        windSpeed: Math.round(data.current.wind_speed_10m),
                        condition: getWeatherLabel(data.current.weather_code),
                        code: data.current.weather_code,
                        forecast: {
                            tomorrow: {
                                maxTemp: Math.round(data.daily.temperature_2m_max[1]),
                                minTemp: Math.round(data.daily.temperature_2m_min[1]),
                                code: data.daily.weather_code[1],
                                condition: getWeatherLabel(data.daily.weather_code[1])
                            }
                        }
                    });
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load weather');
                    setLoading(false);
                }
            }
        };

        const fetchLocation = async () => {
            setLoading(true);
            setError(null);

            // Manual Location
            if (location) {
                try {
                    const geoResponse = await fetch(
                        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
                    );
                    const geoData = await geoResponse.json();

                    if (!geoData.results || geoData.results.length === 0) {
                        throw new Error('Location not found');
                    }

                    const { latitude, longitude } = geoData.results[0];
                    fetchWeather(latitude, longitude);
                } catch (err) {
                    if (isMounted) {
                        setError('Location not found');
                        setLoading(false);
                    }
                }
                return;
            }

            // Auto Location
            if (!navigator.geolocation) {
                if (isMounted) {
                    setError('Geolocation not supported');
                    setLoading(false);
                }
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                (err) => {
                    if (isMounted) {
                        setError('Location access denied');
                        setLoading(false);
                    }
                }
            );
        };

        fetchLocation();

        return () => {
            isMounted = false;
        };
    }, [location]);

    return { weather, loading, error };
};

export default useWeather;
