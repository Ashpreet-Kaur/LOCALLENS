import React, { useContext } from "react";
import FavouritesContext from "../context/FavouritesContext";


const Fav = () => {
  const { favourites, removeFromFavourites } = useContext(FavouritesContext);
 

  //  Extract unique ID (same logic as context)
  const getPlaceId = (place) => {
    return place?.properties?.place_id || 
           place?.properties?.osm_id || 
           place?.id || 
           place?._uniqueId ||
           JSON.stringify(place?.geometry?.coordinates);
  };

  // Stats
  const totalFavourites = favourites.length;

  const uniqueCategories = new Set(
    favourites.map(
      (p) => p?.properties?.category || p?.properties?.categories?.[0] || "Others"
    )
  ).size;

  const avgRating = 4; // Static or calculate if you have ratings
  const savedPlaces = favourites.length;

  return (
    <div className="container-fluid px-3 px-md-5 py-4 bg-light min-vh-100">
      {/* Header */}
      <div className="mb-4">
        <h1 className="display-5 fw-bold text-primary">Your Favorites</h1>
        <p className="text-muted">Places you love appear here</p>
      </div>

      {/* If No Favorites */}
      {favourites.length === 0 ? (
        <div className="text-center py-5 my-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
            width="120"
            className="mb-4 opacity-75"
            alt="No favourites"
          />
          <h2 className="fw-bold mb-3">No Favorites Yet</h2>
          <p className="text-muted mb-4">
            Start exploring and save your favourite places to see them here!
          </p>

          <a href="/explore" className="btn btn-primary btn-lg px-4">
            Discover Places
          </a>
        </div>
      ) : (
        <>
          {/* Favourites List */}
          <div className="row g-4">
            {favourites.map((place, index) => {
              const name = place?.properties?.name;
              const category =
                place?.properties?.category ||
                place?.properties?.categories?.[0] ||
                "Amenity";

              const address =
                place?.properties?.address_line2 ||
                place?.properties?.formatted ||
                "";

              //  Use consistent ID extraction
              const placeId = getPlaceId(place);

              return (
                <div key={placeId || index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card shadow-sm h-100 border-0">
                    <div className="card-body text-center">
                      <h5 className="fw-bold mb-2">{name}</h5>

                      <span className="badge bg-primary rounded-pill px-3 py-2 mb-3">
                        {category}
                      </span>

                      <p className="text-muted small mb-3">{address}</p>

                      {/* Remove from favorites */}
                      <button
                        className="btn btn-outline-danger w-100"
                        onClick={() => removeFromFavourites(place)}
                      >
                        Remove ❤️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="card shadow mt-5 mb-5">
            <div className="card-body">
              <h3 className="mb-4">Your Exploration Stats</h3>

              <div className="row text-center">
                <div className="col-6 col-md-3 mb-3">
                  <h1 className="display-6 text-primary">{totalFavourites}</h1>
                  <p className="text-muted small">Favorites</p>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <h1 className="display-6 text-primary">{uniqueCategories}</h1>
                  <p className="text-muted small">Categories</p>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <h1 className="display-6 text-primary">{avgRating}</h1>
                  <p className="text-muted small">Avg Rating</p>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <h1 className="display-6 text-primary">{savedPlaces}</h1>
                  <p className="text-muted small">Places Saved</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Fav;
