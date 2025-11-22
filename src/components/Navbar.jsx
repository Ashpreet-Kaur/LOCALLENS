import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

 

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">📍LocalLens</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll"
            aria-controls="navbarScroll"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarScroll">
            {/* Left Side - Nav Links */}
            <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ "--bs-scroll-height": "100px" }}>
              <li className="nav-item">
             
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/Explore" className="nav-link">Explore</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/Favourite" className="nav-link">Favourite</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/Profile" className="nav-link">Profile</NavLink>
              </li>
            </ul>

            <div className="d-flex">
              {isLoggedIn ? (
                <button
                  className="btn btn-outline-success"
                  onClick={handleLogout}
                >
                 😞 Logout 
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className="btn btn-outline-success"
                >
                 😊 Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;