import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { useToast } from './ToastContext';

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
  const toast = useToast();

  // Check if using Supabase or mock mode
  const usingSupabase = isSupabaseConfigured();

  useEffect(() => {
    if (usingSupabase) {
      // Supabase mode: Check for existing session
      checkUser();

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Mock mode: Check localStorage
      const storedUser = localStorage.getItem('castreach_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    }
  }, [usingSupabase]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error loading profile:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const login = async (email, password, role) => {
    if (usingSupabase) {
      // Supabase login
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        await loadUserProfile(data.user.id);
        return user;
      } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Failed to login');
      }
    } else {
      // Mock login
      const mockUser = {
        id: Date.now(),
        email,
        role,
        name: email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=6366f1&color=fff`,
        created_at: new Date().toISOString(),
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('castreach_user', JSON.stringify(mockUser));
      return mockUser;
    }
  };

  const signup = async (email, password, role, name) => {
    if (usingSupabase) {
      // Supabase signup
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // Wait a moment for the trigger to create the profile
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Load the profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.error('Profile load error:', profileError);
            // Profile might not exist yet, create it manually
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: data.user.email,
                name,
                role,
              })
              .select()
              .single();

            if (createError) throw createError;

            setUser(newProfile);
            setIsAuthenticated(true);
            return newProfile;
          }

          setUser(profile);
          setIsAuthenticated(true);
          return profile;
        }

        throw new Error('Signup failed - no user returned');
      } catch (error) {
        console.error('Signup error:', error);
        throw new Error(error.message || 'Failed to sign up');
      }
    } else {
      // Mock signup
      const mockUser = {
        id: Date.now(),
        email,
        role,
        name,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`,
        created_at: new Date().toISOString(),
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('castreach_user', JSON.stringify(mockUser));
      return mockUser;
    }
  };

  const logout = async () => {
    if (usingSupabase) {
      // Supabase logout
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        console.error('Logout error:', error);
      }
    } else {
      // Mock logout
      localStorage.removeItem('castreach_user');
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (updates) => {
    if (usingSupabase) {
      // Supabase update
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();

        if (error) throw error;

        setUser(data);
        return data;
      } catch (error) {
        console.error('Update profile error:', error);
        throw new Error(error.message || 'Failed to update profile');
      }
    } else {
      // Mock update
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('castreach_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    usingSupabase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
