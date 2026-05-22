import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type UserRole = 'employee' | 'admin' | 'ceo';

export interface AuthUser {
  id: string;
  name: string;
  role: string;
  department: string;
  initials: string;
  email: string;
  avatarColor: string;
  systemRole: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  loginWithCredentials: (email: string, password: string) => { success: boolean; error?: string };
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
}

const MOCK_USERS: Array<{ email: string; password: string; user: AuthUser }> = [
  {
    email: 'employee@connectsphere.com',
    password: 'password123',
    user: { id: 'emp-1', name: 'Alex Rivera', role: 'Senior Engineer', department: 'Engineering', initials: 'AR', email: 'employee@connectsphere.com', avatarColor: '#06b6d4', systemRole: 'employee' },
  },
  {
    email: 'admin@connectsphere.com',
    password: 'admin123',
    user: { id: 'admin-1', name: 'Michael Torres', role: 'HR Director', department: 'HR', initials: 'MT', email: 'admin@connectsphere.com', avatarColor: '#8b5cf6', systemRole: 'admin' },
  },
  {
    email: 'ceo@connectsphere.com',
    password: 'ceo123',
    user: { id: 'ceo-1', name: 'Sarah Chen', role: 'CEO', department: 'Leadership', initials: 'SC', email: 'ceo@connectsphere.com', avatarColor: '#6366f1', systemRole: 'ceo' },
  },
];

const STORAGE_KEY = 'cs_mobile_user';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved) {
        try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
      }
      setLoading(false);
    });
  }, []);

  const persist = (u: AuthUser) => {
    setUser(u);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const loginWithCredentials = (email: string, password: string): { success: boolean; error?: string } => {
    const entry = MOCK_USERS.find((u) => u.email === email.trim().toLowerCase());
    if (!entry) return { success: false, error: 'No account found with that email address.' };
    if (entry.password !== password) return { success: false, error: 'Incorrect password. Please try again.' };
    persist(entry.user);
    return { success: true };
  };

  const loginAsRole = (role: UserRole) => {
    const entry = MOCK_USERS.find((u) => u.user.systemRole === role);
    if (entry) persist(entry.user);
  };

  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithCredentials, loginAsRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
