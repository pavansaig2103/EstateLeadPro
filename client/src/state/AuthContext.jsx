import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/http';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('estatelead_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('estatelead_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      localStorage.removeItem('estatelead_user');
      return null;
    }
  });

  useEffect(() => {
    function syncLogout() {
      setToken(null);
      setUser(null);
    }
    window.addEventListener('estatelead:logout', syncLogout);
    return () => window.removeEventListener('estatelead:logout', syncLogout);
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('estatelead_token', data.token);
    localStorage.setItem('estatelead_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('estatelead_token');
    localStorage.removeItem('estatelead_user');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ token, user, login, logout, isAuthenticated: Boolean(token) }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
