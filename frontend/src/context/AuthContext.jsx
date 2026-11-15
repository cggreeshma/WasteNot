import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfile } from '../api/authApi';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await getProfile();
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (_) {}
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
