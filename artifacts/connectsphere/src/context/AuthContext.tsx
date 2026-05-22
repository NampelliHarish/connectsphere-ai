import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'employee' | 'admin' | 'ceo';

export interface User {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  systemRole: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (systemRole: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cs_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const login = (systemRole: UserRole) => {
    let newUser: User;
    if (systemRole === 'ceo') {
      newUser = { id: 'ceo-1', name: 'Sarah Chen', role: 'CEO', department: 'Leadership', avatar: 'SC', systemRole: 'ceo' };
    } else if (systemRole === 'admin') {
      newUser = { id: 'admin-1', name: 'Michael Scott', role: 'HR Director', department: 'HR', avatar: 'MS', systemRole: 'admin' };
    } else {
      newUser = { id: 'emp-1', name: 'Alex Rivera', role: 'Senior Engineer', department: 'Engineering', avatar: 'AR', systemRole: 'employee' };
    }
    setUser(newUser);
    localStorage.setItem('cs_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cs_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
