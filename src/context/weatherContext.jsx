// src/context/weatherContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import LocationContext from './LocationContext';

const weatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(null); //  Start with null instead of {} to indicate no data yet
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const { location } = useContext(LocationContext);
  

  const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  }

  useEffect(() => {
    // Check if location has valid data before fetching
    if (!location?.latitude || !location?.longitude) {
      setWeather(null); // Reset weather if location is lost
      return;
    }

    const fetchWeather = async () => {
      setIsLoading(true); //  Start loading
      
      try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&hourly=temperature_2m,wind_speed_10m,wind_direction_10m&timezone=auto`;
        const response = await fetch(weatherUrl);
        
        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }
        
        const weatherData = await response.json();
        const cw = weatherData?.current_weather;
        
        if (!cw) {
          setWeather(null);
          return;
        }
        
        setWeather({
          temperature: cw.temperature,
          windspeed: cw.windspeed,
          winddirection: cw.winddirection,
          weathercode: cw.weathercode,
          time: cw.time,
          weatherText: weatherCodes[cw.weathercode] || 'Unknown',
        });
      } catch (err) {
        console.error('weather fetch error', err);
        setWeather(null); // Set to null on error
      } finally {
        setIsLoading(false); // Done loading
      }
    };

    //  Add small delay to ensure location is fully set
    const timeoutId = setTimeout(fetchWeather, 100);
    
    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
  }, [location]);

  return (
    <weatherContext.Provider value={{ weather, setWeather, isLoading }}>
      {children}
    </weatherContext.Provider>
  );
};

export default weatherContext;
