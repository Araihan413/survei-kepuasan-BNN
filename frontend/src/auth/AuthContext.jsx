import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null, // { username: "", role: "" }
    token: null
  });

  const login = (userData, token) => {
    setAuth({
      isAuthenticated: true,
      user: userData,
      token: token
    });
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null
    });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);