// src/context/LocationContext.js
import { createContext, useState } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({});
  const [address, setAddress] = useState({});
  const [explore, setExplore] = useState([]);
  const [prompt, setPrompt] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

 
  const getLocation = () => {
    setIsLoading(true); //  Start loading
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        setLocation({ latitude: lat, longitude: long });
        setPrompt(false);

        //  API URLs
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`;
        
        //  Get API key from environment variables (secure way)
        // In Vite, use import.meta.env.VITE_* to access .env variables
        const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
        const exploreUrl = `https://api.geoapify.com/v2/places?categories=accommodation,activity,airport,commercial,catering,emergency,education,childcare,entertainment,healthcare,heritage,highway,leisure,man_made,natural,office,parking,pet,power,production,railway,rental,service,tourism,religion,camping,amenity,beach,adult,building,ski,sport,public_transport,memorial&filter=circle:${long},${lat},3000&apiKey=${apiKey}`;

        // fetch address
        (async () => {
          try {
            const response = await fetch(url);
            const data = await response.json();
            setAddress({
              city: data.city || data.locality || '',
              country: data.countryName || '',
            });
          } catch (err) {
            console.error('reverse geocode error', err);
          }
        })();

        // fetch nearby places
        (async () => {
          try {
            const response = await fetch(exploreUrl);
            const exploreData = await response.json();
            setExplore(exploreData.features || []);
            console.log('explore data', exploreData);
          } catch (error) {
            console.error('explore fetch error', error);
          } finally {
            setIsLoading(false); // Done loading
          }
        })();
      },
      (error) => {
        //  Handle location permission denied/error
        console.error('geolocation error', error);
        setIsLoading(false);
        
        // User-friendly error messages
        if (error.code === 1) {
          alert('Location access denied. Please enable location permissions in your browser settings.');
        } else if (error.code === 2) {
          alert('Location unavailable. Please check your device settings.');
        } else if (error.code === 3) {
          alert('Location request timed out. Please try again.');
        }
      }
    );
  };

  //  Function to handle "Maybe Later" button
  const dismissPrompt = () => {
    setPrompt(false);
    // Store in localStorage so prompt doesn't reappear immediately
    localStorage.setItem('locationPromptDismissed', 'true');
  };

  return (
    <LocationContext.Provider
      value={{
        getLocation,
        location,
        address,
        explore,
        prompt,
        setPrompt,
        dismissPrompt, // Function for "Maybe Later" button
        isLoading, // Loading state
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
