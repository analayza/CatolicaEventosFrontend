import { createContext, useState, useEffect, useRef } from "react";
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const logoutTimer = useRef(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  function logoutContext() {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
    setUserId(null);
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
  }

  function scheduleLogout(exp) {
    const now = Date.now() / 1000;
    const timeLeft = (exp - now) * 1000; 

    if (timeLeft <= 0) {
      logoutContext();
      return;
    }

    logoutTimer.current = setTimeout(() => {
      logoutContext();
      alert("Sua sessão expirou, faça login novamente."); //Depois removo
    }, timeLeft);
  }

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      const decoded = jwtDecode(savedToken);
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp > now) {
        setToken(savedToken);
        setRole(decoded.role);
        setUserId(decoded.userId);
        scheduleLogout(decoded.exp);
      } else {
        logoutContext();
      }
    }
    setLoadingAuth(false)
  }, []);

  function loginContext(newToken) {
    localStorage.setItem('token', newToken);
    const decoded = jwtDecode(newToken);
    setToken(newToken);
    setRole(decoded.role);
    setUserId(decoded.userId);
    if (decoded.exp) {
      scheduleLogout(decoded.exp);
    }
  }

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loginContext, logoutContext, token, role, userId, loadingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
