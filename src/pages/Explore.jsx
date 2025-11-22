import React, { useContext } from "react";
import "./Explore.css";
import Navbar from "../components/Navbar";
import LocationContext from "../context/LocationContext";
import getPlaceIcons from "../utils/getPlaceIcons";
import FavouritesContext from "../context/FavouritesContext";

const Explore = () => {
  const { explore = [], getLocation } = useContext(LocationContext);
  const { toggleFavourite, isFavourite } = useContext(FavouritesContext);

  const filteredPlaces = (explore || []).filter(
    (place) => place?.properties?.name
  );

  return (
    <>
      <div className="explore-page container py-5">
        <div className="mb-4">
          <h1 className="explore-title">Explore Local Places</h1>
          <p className="text-muted">Discover amazing spots tailored to your preferences</p>
        </div>

       
        <div className="filter-card p-3 mb-4 rounded shadow-sm">
          <div className="d-flex gap-3 flex-wrap">
            <div className="filter-pill">🌐 All Categories</div>
            <div className="filter-pill">📍 Any Distance</div>
            <div className="filter-pill">🙂 Any Mood</div>
            <div className="ms-auto view-toggle">
              <button className="btn btn-sm btn-outline-primary ">Grid</button>
              <button className="btn btn-sm btn-outline-secondary">List</button>
            </div>
          </div>
        </div>

        <div className="mb-3 text-muted">Found <strong>{filteredPlaces.length}</strong> places near you</div>

        {filteredPlaces.length === 0 ? (
          <div className="center-section text-center py-5">
            <img
              src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
              alt="map"
              className="map-icon mb-3"
              style={{ width: 80, opacity: 0.7 }}
            />
            <h3>No places found nearby</h3>
            <p>Enable location access to discover amazing places near you!</p>
            <button className="btn btn-primary" onClick={getLocation}>
              Enable Location
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredPlaces.map((place, idx) => {
              const key =
                place?.properties?.place_id ||
                place?.properties?.osm_id ||
                place?.id ||
                idx;
              const icon = getPlaceIcons(place);
              const categoryLabel =
                (place?.properties?.categories && place?.properties?.building ?.type ) ||
                
                "Amenity";
              const address = place?.properties?.address_line2 || place?.properties?.formatted || "";

              return (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={key}>
                  <div className="card h-100 shadow-sm border-0">
                    
                    <div className="thumb-wrap">
                    
                      <div className="thumb-icon">{icon}</div>
                    </div>

                    <div className="card-body text-center pt-3">
                      <h5 className="card-title fw-semibold">{place.properties.name}</h5>
                     

                      <span className="badge bg-primary rounded-pill px-3 py-2 mb-3">{categoryLabel}</span>

                     
                      <p className="text-muted small">{address}</p>

                      <div className="d-flex gap-2 mt-3">
                        {/*  Toggle button: Save/Unsave with proper state */}
                        <button
                          className={`btn flex-fill ${
                            isFavourite(place)
                              ? "btn-danger text-white"  
                              : "btn-outline-primary"    
                          }`}
                          onClick={() => toggleFavourite(place)}
                        >
                          {isFavourite(place) ? "Unsave ❤️" : "Save 🤍"}
                        </button>
                        <button className="btn btn-outline-primary flex-fill">Directions</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Explore;
