import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SettingsContext from "../context/SettingsContext";
import FavouritesContext from "../context/FavouritesContext";

const Profile = () => {
  const navigate = useNavigate();
  // ✅ Get user from Context (single source of truth)
  const { currentUser, logout, updateUser } = useContext(AuthContext);
  
  // ⚙️ Get settings from SettingsContext (now dynamic and persistent!)
  const {
    darkMode, toggleDarkMode,
    tempUnit, setTempUnit,
    locationAccess, toggleLocationAccess,
    pushNotifications, togglePushNotifications,
    autoSuggestions, toggleAutoSuggestions
  } = useContext(SettingsContext);

  // ❤️ Get favourites for activity stats
  const { favourites } = useContext(FavouritesContext);

  // Edit mode toggle
  const [isEditing, setIsEditing] = useState(false);

  // Editable user data
  const [user, setUser] = useState(currentUser || { name: "", email: "" });

  // 🔄 Update user state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  // Sign out using Context (handles both state and localStorage)
  function handleSignout() {
    logout();
    navigate("/login");
  }

  // Save updated profile using Context (syncs with localStorage)
  function handleSave() {
    updateUser(user);
    alert("Profile updated successfully!");
    setIsEditing(false);
  }

  // 🎨 Toggle switch component (Bootstrap styled)
  const Toggle = ({ isOn, onToggle }) => (
    <div
      onClick={onToggle}
      className="form-check form-switch"
      style={{ cursor: "pointer" }}
    >
      <input
        className="form-check-input"
        type="checkbox"
        checked={isOn}
        onChange={() => {}}
        style={{ width: "45px", height: "25px" }}
      />
    </div>
  );

  // 📊 Calculate activity stats
  const totalFavourites = favourites?.length || 0;
  const uniqueCategories = new Set(
    (favourites || []).map(p => p?.properties?.category || p?.properties?.categories?.[0] || 'Other')
  ).size;

  return (
    <>
      {/* Header */}
      <div className="container-fluid px-4 px-md-5 mt-4">
        <h1 className="display-5 fw-bold text-primary">Profile & Settings</h1>
        <p className="text-muted">Manage your account and preferences</p>
      </div>

      {/* Conditional: Edit or View Profile */}
      {isEditing && currentUser ? (
        // ------------------- EDIT PROFILE (Responsive Card) -------------------
        <div className="container-fluid px-4 px-md-5 mb-5">
          <div className="card shadow-lg mx-auto" style={{ maxWidth: "600px" }}>
            <div className="card-body p-4">
              <h2 className="text-primary mb-4 text-center">Edit Profile</h2>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div className="d-flex gap-2 justify-content-center">
                <button onClick={handleSave} className="btn btn-outline-primary">
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ------------------- PROFILE VIEW (Responsive) -------------------
        <div className="container-fluid px-4 px-md-5 mb-5">
          <div className="card shadow-lg mx-auto" style={{ maxWidth: "1000px" }}>
            <div className="card-body text-center py-5">
              <div
                className="bg-primary text-white d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ width: "100px", height: "100px", fontSize: "40px" }}
              >
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "?"}
              </div>
              <h2 className="mb-1">{currentUser?.name || "User name"}</h2>
              <p className="text-muted">{currentUser?.email || "Email not Found"}</p>
              <p className="text-muted">
                Location not available - Member since November 2025
              </p>
              <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                {currentUser && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline-primary"
                  >
                    Edit Profile
                  </button>
                )}
                <button onClick={handleSignout} className="btn btn-outline-danger">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------- Display & Privacy Settings (Responsive Grid) ------------- */}
      <div className="container-fluid px-4 px-md-5 mb-5">
        <div className="row g-4">
          {/* Display Settings */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h4 className="mb-4">Display Settings</h4>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <strong>Dark Mode</strong>
                    <br />
                    <small className="text-muted">
                      {darkMode ? '🌙 Dark theme enabled' : '☀️ Light theme active'}
                    </small>
                  </div>
                  <Toggle isOn={darkMode} onToggle={toggleDarkMode} />
                </div>

                <div>
                  <strong>Temperature Units</strong>
                  <div className="btn-group w-100 mt-2" role="group">
                    <button
                      onClick={() => setTempUnit("C")}
                      className={`btn ${tempUnit === "C" ? "btn-success" : "btn-outline-secondary"}`}
                    >
                      °C Celsius
                    </button>
                    <button
                      onClick={() => setTempUnit("F")}
                      className={`btn ${tempUnit === "F" ? "btn-success" : "btn-outline-secondary"}`}
                    >
                      °F Fahrenheit
                    </button>
                  </div>
                  <small className="text-muted d-block mt-2">
                    Currently showing temperatures in °{tempUnit}
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Permissions */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h4 className="mb-4">Privacy & Permissions</h4>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <strong>Location Access</strong>
                    <br />
                    <small className="text-muted">
                      {locationAccess ? '✅ Enabled' : '❌ Disabled'}
                    </small>
                  </div>
                  <Toggle isOn={locationAccess} onToggle={toggleLocationAccess} />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <strong>Push Notifications</strong>
                    <br />
                    <small className="text-muted">
                      {pushNotifications ? '🔔 Receiving notifications' : '🔕 Notifications off'}
                    </small>
                  </div>
                  <Toggle isOn={pushNotifications} onToggle={togglePushNotifications} />
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Auto Suggestions</strong>
                    <br />
                    <small className="text-muted">
                      {autoSuggestions ? '💡 Smart suggestions enabled' : '⭕ Manual mode'}
                    </small>
                  </div>
                  <Toggle isOn={autoSuggestions} onToggle={toggleAutoSuggestions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------- Activity Section (Responsive Grid) ------------- */}
      <div className="container-fluid px-4 px-md-5 mb-5">
        <div className="card shadow-lg">
          <div className="card-body">
            <h3 className="mb-4">Your Activity</h3>
            <div className="row text-center">
              <div className="col-6 col-md-3 mb-3">
                <h1 className="display-6 text-primary">{totalFavourites}</h1>
                <p className="text-muted">Places Saved</p>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <h1 className="display-6 text-primary">{uniqueCategories}</h1>
                <p className="text-muted">Categories Explored</p>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <h1 className="display-6 text-primary">⭐</h1>
                <p className="text-muted">Coming Soon</p>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <h1 className="display-6 text-primary">🎯</h1>
                <p className="text-muted">Active User</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;