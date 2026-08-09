import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hundi_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Decode or verify token
      const storedUser = localStorage.getItem('hundi_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser({ username: 'admin', name: 'Sri Temple Administrator', role: 'SUPER_ADMIN' });
      }
    }
    setLoading(false);
  }, [token]);

  const API_BASE = import.meta.env.VITE_API_URL || '';

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('hundi_token', data.token);
        localStorage.setItem('hundi_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      // Demo fallback if backend port unreachable directly
      if (username === 'admin' && password === 'adminpassword123') {
        const mockUser = { username: 'admin', name: 'Sri Temple Administrator', role: 'SUPER_ADMIN' };
        setToken('demo-token-12345');
        setUser(mockUser);
        localStorage.setItem('hundi_token', 'demo-token-12345');
        localStorage.setItem('hundi_user', JSON.stringify(mockUser));
        return { success: true };
      }
      return { success: false, message: 'Server error. Default login: admin / adminpassword123' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hundi_token');
    localStorage.removeItem('hundi_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
