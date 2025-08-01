import { createContext, useState, useContext, ReactNode } from 'react';
import { AuthContextType, AuthState, User } from '../lib/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : { isAuthenticated: false, user: null };
  });

  const login = (userData: User) => {
    const newState: AuthState = {
      isAuthenticated: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
      },
    };
    setAuthState(newState);
    localStorage.setItem('auth', JSON.stringify(newState));
  };

  const logout = () => {
    const newState: AuthState = { isAuthenticated: false, user: null };
    setAuthState(newState);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
