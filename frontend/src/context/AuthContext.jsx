import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      // data: { token, userId, email, roles }
      setToken(data.token);
      
      const userData = {
        userId: data.userId,
        email: data.email,
        roles: Array.isArray(data.roles) ? data.roles : [data.roles || 'ROLE_CUSTOMER']
      };
      
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, roleType = 'CUSTOMER') => {
    setLoading(true);
    try {
      const data = await authService.register(userData, roleType);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    const targetRole = roleName.startsWith('ROLE_') ? roleName : `ROLE_${roleName}`;
    return user.roles.some(
      (r) => r === targetRole || r === roleName || (typeof r === 'object' && r.name === targetRole)
    );
  };

  const isAdmin = () => hasRole('ADMIN');
  const isCustomer = () => hasRole('CUSTOMER');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        hasRole,
        isAdmin,
        isCustomer,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
