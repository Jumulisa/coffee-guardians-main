import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authApi, userApi, getToken, removeToken, User as ApiUser } from '../lib/api-service';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  language?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (full_name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convert API user to context user format
const mapApiUserToUser = (apiUser: ApiUser): User => ({
  id: String(apiUser.id),
  email: apiUser.email,
  full_name: apiUser.full_name,
  avatar_url: apiUser.avatar_url,
  language: apiUser.language,
  createdAt: apiUser.created_at,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { user: apiUser } = await authApi.getCurrentUser();
        setUser(mapApiUserToUser(apiUser));
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Token might be invalid, remove it
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { user: apiUser } = await authApi.login(email, password);
      setUser(mapApiUserToUser(apiUser));
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw err;
    }
  }, []);

  const signup = useCallback(async (full_name: string, email: string, password: string) => {
    try {
      const { user: apiUser } = await authApi.signup(email, password, full_name);
      setUser(mapApiUserToUser(apiUser));
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const resetPassword = useCallback(async (_email: string) => {
    // For now, show a message that this feature requires email setup
    throw new Error('Password reset requires email configuration. Please contact support.');
  }, []);

  const updateProfile = useCallback(async (updates: { full_name?: string; avatar_url?: string }) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      const updatedUser = await userApi.updateProfile(updates);
      setUser(mapApiUserToUser(updatedUser));
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw err;
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
