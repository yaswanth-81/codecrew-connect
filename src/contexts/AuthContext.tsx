import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'student' | 'recruiter' | 'placement' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const mockUsers: Record<UserRole, User> = {
  student: {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  recruiter: {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    role: 'recruiter',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  placement: {
    id: '3',
    name: 'Dr. Michael Roberts',
    email: 'm.roberts@university.edu',
    role: 'placement',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
  },
  faculty: {
    id: '4',
    name: 'Prof. Emily Davis',
    email: 'e.davis@university.edu',
    role: 'faculty',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  },
  admin: {
    id: '5',
    name: 'James Wilson',
    email: 'j.wilson@university.edu',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    setUser(mockUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
