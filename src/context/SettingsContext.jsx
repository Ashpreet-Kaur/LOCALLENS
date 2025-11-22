import { createContext, useState, useEffect } from 'react';

/**
 * SettingsContext - Manage User Preferences
 * 
 * Stores user settings like dark mode, temperature units, etc.
 * Settings persist in localStorage and sync across all components
 * 
 * Usage:
 *   const { darkMode, toggleDarkMode, tempUnit, setTempUnit } = useContext(SettingsContext);
 */
export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  //  Display Settings
  const [darkMode, setDarkMode] = useState(false);
  const [tempUnit, setTempUnit] = useState('C'); // 'C' or 'F'

  //  Privacy Settings
  const [locationAccess, setLocationAccess] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoSuggestions, setAutoSuggestions] = useState(true);

  //  Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setDarkMode(settings.darkMode || false);
        setTempUnit(settings.tempUnit || 'C');
        setLocationAccess(settings.locationAccess || false);
        setPushNotifications(settings.pushNotifications !== false); // Default true
        setAutoSuggestions(settings.autoSuggestions !== false); // Default true
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  //  Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      darkMode,
      tempUnit,
      locationAccess,
      pushNotifications,
      autoSuggestions,
    };
    localStorage.setItem('userSettings', JSON.stringify(settings));

    //  Apply dark mode to document
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode, tempUnit, locationAccess, pushNotifications, autoSuggestions]);

  //  Helper functions for toggling
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLocationAccess = () => setLocationAccess(!locationAccess);
  const togglePushNotifications = () => setPushNotifications(!pushNotifications);
  const toggleAutoSuggestions = () => setAutoSuggestions(!autoSuggestions);

  // 🌡️Temperature conversion helper
  const convertTemp = (celsius) => {
    if (tempUnit === 'F') {
      return Math.round((celsius * 9/5) + 32);
    }
    return Math.round(celsius);
  };

  return (
    <SettingsContext.Provider
      value={{
        // Settings state
        darkMode,
        tempUnit,
        locationAccess,
        pushNotifications,
        autoSuggestions,
        // Setters
        setDarkMode,
        setTempUnit,
        setLocationAccess,
        setPushNotifications,
        setAutoSuggestions,
        // Toggle functions
        toggleDarkMode,
        toggleLocationAccess,
        togglePushNotifications,
        toggleAutoSuggestions,
        // Helper functions
        convertTemp,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
