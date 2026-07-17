'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Types
export interface User {
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  demoLogin: () => void;
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'supernova_users',
  CURRENT_USER: 'supernova_current_user',
  IS_LOGGED_IN: 'supernova_is_logged_in',
} as const;

// Local storage utilities
const getUsers = (): Record<string, { name: string; email: string; password: string; createdAt: string }> => {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  return stored ? JSON.parse(stored) : {};
};

const saveUsers = (users: Record<string, { name: string; email: string; password: string; createdAt: string }>) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

const setCurrentUser = (user: User | null, isLoggedIn: boolean) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
  localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, String(isLoggedIn));
};

// Validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  return { valid: true };
};

// Auth functions
export const signIn = (email: string, password: string): { success: boolean; error?: string } => {
  const users = getUsers();
  const user = users[email];

  if (!user) {
    return { success: false, error: 'No account found with this email' };
  }

  if (user.password !== password) {
    return { success: false, error: 'Incorrect password' };
  }

  setCurrentUser({ email: user.email, name: user.name, createdAt: user.createdAt }, true);
  return { success: true };
};

export const signUp = (name: string, email: string, password: string): { success: boolean; error?: string } => {
  if (!name.trim()) {
    return { success: false, error: 'Name is required' };
  }

  if (!validateEmail(email)) {
    return { success: false, error: 'Please enter a valid email address' };
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return { success: false, error: passwordValidation.error };
  }

  const users = getUsers();

  if (users[email]) {
    return { success: false, error: 'An account with this email already exists' };
  }

  users[email] = {
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  saveUsers(users);

  return { success: true };
};

export const demoLogin = (): void => {
  const demoUser: User = {
    email: 'demo@supernova.ai',
    name: 'Demo User',
    createdAt: new Date().toISOString(),
  };
  setCurrentUser(demoUser, true);
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    isLoading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const user = storedUser ? JSON.parse(storedUser) : null;

      setState({
        isLoggedIn,
        user,
        isLoading: false,
      });
    };

    checkAuth();

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleStorageChange);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = signIn(email, password);
    
    if (result.success) {
      const users = getUsers();
      const user = users[email];
      setState({
        isLoggedIn: true,
        user: { email: user.email, name: user.name, createdAt: user.createdAt },
        isLoading: false,
      });
    }
    
    return result;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    return signUp(name, email, password);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null, false);
    setState({
      isLoggedIn: false,
      user: null,
      isLoading: false,
    });
  }, []);

  const demoLoginHandler = useCallback(() => {
    demoLogin();
    setState({
      isLoggedIn: true,
      user: { email: 'demo@supernova.ai', name: 'Demo User', createdAt: new Date().toISOString() },
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      signup,
      logout,
      demoLogin: demoLoginHandler,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
