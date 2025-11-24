import React, { createContext, useEffect, useState } from 'react';

/**
 *  AuthContext - Centralized Authentication State
 * 
 * 
 * Usage:
 *   const { currentUser, login, logout, updateUser } = useContext(AuthContext);
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // keep currentUser 
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //  Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setCurrentUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Login: Save to both state AND localStorage
  const login = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  //  Logout: Clear both state AND localStorage
  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
  };

  // Update user profile 
  const updateUser = (updatedData) => {
    const newUserData = { ...currentUser, ...updatedData };
    setCurrentUser(newUserData);
    localStorage.setItem('currentUser', JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser, //  Single source of truth for user data
        isLoggedIn,
        login,       //  Use this to log in
        logout,      //  Use this to log out
        updateUser,  //  Use this to update profile (syncs with localStorage)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
