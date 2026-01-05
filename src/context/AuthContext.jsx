import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('castreach_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    // Mock login - in production, this would call an API
    const mockUser = {
      id: Date.now(),
      email,
      role, // 'host', 'guest', or 'organizer'
      name: email.split('@')[0],
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=6366f1&color=fff`,
      createdAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('castreach_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const signup = (email, password, role, name) => {
    // Mock signup - in production, this would call an API
    const mockUser = {
      id: Date.now(),
      email,
      role,
      name: name || email.split('@')[0],
      avatar: `https://ui-avatars.com/api/?name=${name || email.split('@')[0]}&background=6366f1&color=fff`,
      createdAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('castreach_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('castreach_user');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('castreach_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
