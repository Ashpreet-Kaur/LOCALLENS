import { createContext, useContext, useState, useEffect } from "react";

/**
 * FavouritesContext - Manage User's Favorite Places
 *

 */
const FavouritesContext = createContext();


export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);

  //  Load from localStorage on mount 
  useEffect(() => {
    const stored = localStorage.getItem("favourites");
    if (stored) {
      try {
        const parsedFavourites = JSON.parse(stored);
        setFavourites(parsedFavourites);
      } catch (error) {
        console.error('Failed to parse favourites:', error);
        setFavourites([]);
      }
    }
  }, []);

  // 💾Auto-save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  // Extract unique ID from place object (handles different API formats)
  const getPlaceId = (place) => {
    return place?.properties?.place_id || 
           place?.properties?.osm_id || 
           place?.id || 
           JSON.stringify(place?.geometry?.coordinates); 
  };

  //  Add item (prevent duplicates)
  const addToFavourites = (place) => {
    const placeId = getPlaceId(place);
    const exists = favourites.some((item) => getPlaceId(item) === placeId);
    if (!exists) {
   
      const placeWithId = { ...place, _uniqueId: placeId };
      setFavourites([...favourites, placeWithId]);
    }
  };

  // Remove item
  const removeFromFavourites = (place) => {
    const placeId = getPlaceId(place);
    const updated = favourites.filter((item) => getPlaceId(item) !== placeId);
    setFavourites(updated);
  };

  //   Add if not favorite, remove if already favorite
  const toggleFavourite = (place) => {
    const placeId = getPlaceId(place);
    const exists = favourites.some((item) => getPlaceId(item) === placeId);
    
    if (exists) {
      // Already in favorites - remove it
      removeFromFavourites(place);
    } else {
      // Not in favorites - add it
      addToFavourites(place);
    }
  };

  //  Check if place is in favourites
  const isFavourite = (place) => {
    const placeId = getPlaceId(place);
    return favourites.some((item) => getPlaceId(item) === placeId);
  };

  return (
    <FavouritesContext.Provider
      value={{ 
        favourites, 
        addToFavourites, 
        removeFromFavourites, 
        toggleFavourite,
        isFavourite 
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export default FavouritesContext;
