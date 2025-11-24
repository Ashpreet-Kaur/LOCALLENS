// src/context/LocationContext.js
import { createContext, useState } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({});
  const [address, setAddress] = useState({});
  const [explore, setExplore] = useState([]);
  const [prompt, setPrompt] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

 
 const getLocation = async () => {
  setIsLoading(true);

  try {
    // 1Fetch IP-based location
    const ipRes = await fetch("https://ipapi.co/json/");
    const ipData = await ipRes.json();

    const lat = ipData.latitude;
    const long = ipData.longitude;

    setLocation({ latitude: lat, longitude: long });
    setPrompt(false);

    // Reverse geocoding (city & country)
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`;

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

    // 3 Nearby places (same logic you already have)
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    const exploreUrl = `https://api.geoapify.com/v2/places?categories=accommodation,activity,airport,commercial,catering,emergency,education,childcare,entertainment,healthcare,heritage,highway,leisure,man_made,natural,office,parking,pet,power,production,railway,rental,service,tourism,religion,camping,amenity,beach,adult,building,ski,sport,public_transport,memorial&filter=circle:${long},${lat},3000&apiKey=${apiKey}`;

    (async () => {
      try {
        const response = await fetch(exploreUrl);
        const exploreData = await response.json();
        setExplore(exploreData.features || []);
      } catch (error) {
        console.error('explore fetch error', error);
      } finally {
        setIsLoading(false);
      }
    })();

  } catch (error) {
    console.error("IP location fetch failed:", error);
    alert("Could not fetch location. Check your internet connection.");
    setIsLoading(false);
  }
};

  //  Function to handle "Maybe Later" button
  const dismissPrompt = () => {
    setPrompt(false);
    // Store in localStorage so prompt doesn't reappear immediately
    localStorage.setItem('locationPromptDismissed', 'true');
  };

  //  Function to clear all location data (when user disables location)
  const clearLocation = () => {
    setLocation({});
    setAddress({});
    setExplore([]);
    setPrompt(true);
    localStorage.removeItem('locationPromptDismissed');
  };

  return (
    <LocationContext.Provider
      value={{
        getLocation,
        clearLocation, // Function to clear location data
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
