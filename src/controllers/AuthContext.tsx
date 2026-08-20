import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../models/firebase';
import { UserProfile } from '../models/types';
import { 
  ADMIN_EMAIL, 
  ADMIN_DEFAULT_PASSWORD, 
  getUserProfile, 
  loginWithEmail, 
  registerWithEmail, 
  logoutUser, 
  isUserAdmin 
} from '../models/userModel';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  login: (email: string, pass: string) => Promise<UserProfile>;
  register: (email: string, pass: string, name: string, phone?: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  quickLoginAdmin: () => Promise<UserProfile>;
  quickLoginCustomer: () => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Check saved session in local storage as quick cache
    const savedUser = localStorage.getItem('aura_active_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {}
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid, firebaseUser.email || '');
          setUser(profile);
          localStorage.setItem('aura_active_user', JSON.stringify(profile));
        } catch (e) {
          console.warn('Error loading user profile:', e);
        }
      } else if (!savedUser) {
        // If not stored in local cache, user is null
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const profile = await loginWithEmail(email, pass);
      setUser(profile);
      localStorage.setItem('aura_active_user', JSON.stringify(profile));
      setIsAuthModalOpen(false);
      return profile;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string, phone?: string) => {
    setIsLoading(true);
    try {
      const profile = await registerWithEmail(email, pass, name, phone);
      setUser(profile);
      localStorage.setItem('aura_active_user', JSON.stringify(profile));
      setIsAuthModalOpen(false);
      return profile;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem('aura_active_user');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLoginAdmin = async () => {
    return login(ADMIN_EMAIL, ADMIN_DEFAULT_PASSWORD);
  };

  const quickLoginCustomer = async () => {
    return login('cliente.demo@auraelegance.com', '1234567890');
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const isAdmin = isUserAdmin(user?.email, user?.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode,
        login,
        register,
        logout,
        quickLoginAdmin,
        quickLoginCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
