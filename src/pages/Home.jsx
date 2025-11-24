// src/pages/Home.jsx
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LocationContext from "../context/LocationContext";
import weatherContext from "../context/weatherContext"; 
import "../utils/getPlaceIcons"
import getPlaceIcons, { placeIcons } from "../utils/getPlaceIcons";
import SettingsContext from "../context/SettingsContext";


const Home = () => {
  // Get user from Context (single source of truth)
  const { isLoggedIn, currentUser } = useContext(AuthContext);
  
  // Get settings (for temperature unit and location sync)
  const { convertTemp, tempUnit, setLocationAccess } = useContext(SettingsContext);
  
  const locationCtx = useContext(LocationContext);
  const { address, location, prompt, getLocation, explore } = locationCtx;
  const dismissPrompt = locationCtx.dismissPrompt || (() => locationCtx.setPrompt(false));
  const locationLoading = locationCtx.isLoading || false;

  // Sync location access state when location is obtained
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      setLocationAccess(true);
    }
  }, [location, setLocationAccess]);
  
  const weatherCtx = useContext(weatherContext);
  const weather = weatherCtx?.weather;
  const weatherLoading = weatherCtx?.isLoading || false;
  console.log("Weather data in Home:", weather);
  
  //  Safely check weather time (handle null/undefined)
  const hour = weather?.time ? new Date(weather.time).getHours() : new Date().getHours();
  const isNight = hour < 6 || hour >= 18;

 


  return (
    <>
      {isLoggedIn ? (
        <>
         
          {prompt && (
            <div
              className="alert alert-info text-dark mx-4 mt-3 shadow-sm"
              role="alert"
            >
              <h5 className="fw-bold">📍 Enable Location Access</h5>
              <p className="mb-2">
                To provide personalized recommendations and discover places near
                you, LocalLens needs access to your location.
              </p>
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={getLocation}
                disabled={locationLoading}
              >
                {locationLoading ? '🔄 Loading...' : 'Enable Location'}
              </button>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={dismissPrompt}
              >
                Maybe Later
              </button>
            </div>
          )}

          <div className="home-container" style={{ minHeight: "100vh" }}>
            <div
              className="container-fluid mt-4 py-5 px-5 text-white"
              style={{
                background: "linear-gradient(135deg, #0dcaf0, #007bff)",
                borderRadius: "20px",
              }}
            >
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h1 className="fw-bold display-5">
                    Welcome back, {currentUser?.name || "User"}
                  </h1>

                  {address?.city ? (
                    <p className="lead mt-2">
                      📍 {address.city}, {address.country} - Your personalized
                      local guide
                    </p>
                  ) : (
                    <p className="lead mt-2">
                      📍 Getting your location... - Your personalized local
                      guide
                    </p>
                  )}
                </div>

                <div className="col-md-4">
                  <div
                    className="text-center p-4 shadow-sm"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderRadius: "15px",
                    }}
                  >
                    {weatherLoading ? (
                      //  Loading state
                      <>
                        <div style={{ fontSize: "40px" }}>🔄</div>
                        <h4>Loading...</h4>
                        <p className="mb-0">Fetching weather</p>
                      </>
                    ) : weather ? (
                      //  Weather data available
                      <>
                        {isNight ? (
                          <div style={{ fontSize: "40px" }}>🌙</div>
                        ) : (
                          <div style={{ fontSize: "40px" }}>☀️</div>
                        )}
                        <h4>{convertTemp(weather.temperature)}°{tempUnit}</h4>
                        <p className="mb-0">{weather?.weatherText}</p>
                      </>
                    ) : (
                      // No weather data
                      <>
                        <div style={{ fontSize: "40px" }}>🌤️</div>
                        <h4>--°</h4>
                        <p className="mb-0">Weather unavailable</p>
                        <small>Enable location for weather</small>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between pt-5 px-5 align-items-center">
              <h2 className="m-0">Discover Nearby</h2>
              <Link to="/Explore">
                <button className="btn btn-outline-primary fs-5 fw-bold">
                  View All
                </button>
              </Link>
            </div>

          
            {locationLoading ? (
              //  Loading state
              <div className="center-section text-center">
                <div style={{ fontSize: "60px" }}>🔄</div>
                <h3>Finding places near you...</h3>
                <p>Please wait while we fetch nearby locations</p>
              </div>
            ) : (!explore || explore.length === 0) ? (
              //  No places found
              <div className="center-section text-center ">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
                  alt="map"
                  className="map-icon mb-3"
                  style={{ width: 80, opacity: 0.7 }}
                />
                <h3>No places found nearby</h3>
                <p>Enable location access to discover amazing places near you!</p>
                <button 
                  className="btn btn-primary" 
                  onClick={getLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? '🔄 Loading...' : 'Enable Location'}
                </button>
              </div>
            ) : (
              <div className="d-flex px-5 pb-5 pt-5">
                {explore.slice(0, 3).map((place, idx) => {
                  const key =
                    place?.properties?.place_id ||
                    place?.properties?.osm_id ||
                    place?.id ||
                    idx;
                  const icon = getPlaceIcons(place);  
                  return (
                    
                    <div
                      className="container d-flex flex-column border-1 rounded-3 place-card shadow-sm me-2 p-3"
                      key={key}
                      style={{ maxWidth: 300 }}
                    >

                      
                           


                      <div className="card-body text-center pt-3 w-100">
                        <h5 className="card-title fw-semibold">
                          {place?.properties?.name || "Unnamed place"}
                        </h5>
                       
                      <div style={{ fontSize: 40, width: 72, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
        {icon}
      </div>
                        <span className="badge bg-primary rounded-pill px-3 py-2 my-3">
                          {place?.properties?.building ?.type || "Various"}
                        </span>

                        <p className="text-muted small">
                          {place?.properties?.address_line2 || place?.properties?.formatted || ""}
                        </p>

                        <div className="d-flex gap-2 mt-3">
                          <button className="btn btn-outline-primary flex-fill">
                            View
                          </button>
                          <button className="btn btn-outline-primary flex-fill">
                            Directions
                          </button>
                        </div>
                      </div>
                    </div>
                    
                  );
                })}
              </div>
              
            )}

               <div className="bottom-section  py-5">
          <h3>What would you like to do?</h3>

          <div className="options">
            <button className="option">🍽 Find Food</button>
            <button className="option">🛒 Shopping</button>
            <button className="option">🎭 Entertainment</button>
            <button className="option">💃🏻 Activities</button>
          </div>
        </div>


            <button
              className="btn btn-primary rounded-circle p-3 shadow position-fixed"
              style={{
                bottom: "30px",
                right: "30px",
                fontSize: "20px",
              }}
            >
              🔍
            </button>
          </div>
        </>
      ) : (
        <div className="home text-center" style={{ paddingTop: "100px" }}>
          <p className="lock-img" style={{ fontSize: "50px" }}>
            🔒
          </p>
          <h1>Authentication Required</h1>
          <p>
            Please log in to access LocalLens features and discover amazing
            places near you.
          </p>

          <Link to="/login" className="btn btn-primary">
            Go To Login
          </Link>
        </div>
      )}
    </>
  );
};

export default Home;
