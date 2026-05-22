import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'employee' | 'admin' | 'ceo';

export interface User {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  email: string;
  systemRole: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (systemRole: UserRole) => void;
  loginWithCredentials: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

// Hardcoded credential store — frontend-only mock auth
const MOCK_USERS: Array<{ email: string; password: string; user: User }> = [
  {
    email: 'employee@connectsphere.com',
    password: 'password123',
    user: {
      id: 'emp-1',
      name: 'Alex Rivera',
      role: 'Senior Engineer',
      department: 'Engineering',
      avatar: 'AR',
      email: 'employee@connectsphere.com',
      systemRole: 'employee',
    },
  },
  {
    email: 'admin@connectsphere.com',
    password: 'admin123',
    user: {
      id: 'admin-1',
      name: 'Michael Torres',
      role: 'HR Director',
      department: 'HR',
      avatar: 'MT',
      email: 'admin@connectsphere.com',
      systemRole: 'admin',
    },
  },
  // Demo shortcut — CEO role (accessible via demo card only)
  {
    email: 'ceo@connectsphere.com',
    password: 'ceo123',
    user: {
      id: 'ceo-1',
      name: 'Sarah Chen',
      role: 'CEO',
      department: 'Leadership',
      avatar: 'SC',
      email: 'ceo@connectsphere.com',
      systemRole: 'ceo',
    },
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cs_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('cs_user');
      }
    }
  }, []);

  // Quick-login by role (used by demo cards)
  const login = (systemRole: UserRole) => {
    const entry = MOCK_USERS.find(u => u.user.systemRole === systemRole);
    if (!entry) return;
    setUser(entry.user);
    localStorage.setItem('cs_user', JSON.stringify(entry.user));
  };

  // Credential-based login (used by the Sign in button)
  const loginWithCredentials = (email: string, password: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const entry = MOCK_USERS.find(u => u.email === trimmedEmail);
    if (!entry) {
      return { success: false, error: 'No account found with that email address.' };
    }
    if (entry.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    setUser(entry.user);
    localStorage.setItem('cs_user', JSON.stringify(entry.user));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cs_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithCredentials, logout }}>
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
