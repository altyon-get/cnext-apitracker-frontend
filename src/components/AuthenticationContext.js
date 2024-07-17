import React, { createContext, useContext, useState } from 'react';

const AuthenticationContext = createContext();

export const useAuth = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Example: User state
  const [token, setToken] = useState(null); // Example: Token state

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    // Optionally, you can store token in localStorage or cookies
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // Clear localStorage or cookies
  };

  const isAuthenticated = () => {
    return !!user && !!token; // Example: Check if user and token exist
  };

  const authContextValue = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthenticationContext.Provider value={authContextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};
