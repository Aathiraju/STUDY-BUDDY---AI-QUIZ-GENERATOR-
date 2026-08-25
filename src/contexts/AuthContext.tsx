import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, Badge } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginUser: (user: UserProfile) => void;
  logout: () => void;
  badges: Badge[];
  updateProfile: (updates: Partial<UserProfile>) => void;
  openAuthModal: boolean;
  setOpenAuthModal: (open: boolean) => void;
}

const INITIAL_BADGES: Badge[] = [
  { id: 'first_quiz', title: 'First Steps', description: 'Complete your first quiz', iconName: 'Award', unlocked: true, unlockedAt: '2026-08-01' },
  { id: 'streak_3', title: 'Dedicated Learner', description: 'Complete 3 quizzes', iconName: 'Award', unlocked: true, unlockedAt: '2026-08-04' },
  { id: 'score_100', title: 'Perfectionist', description: 'Score 100% on a quiz', iconName: 'Star', unlocked: false },
  { id: 'quiz_master', title: 'Quiz Master', description: 'Complete 10 quizzes', iconName: 'Crown', unlocked: false },
  { id: 'speed_demon', title: 'Speed Demon', description: 'Complete a quiz in under 3 minutes', iconName: 'Zap', unlocked: false },
  { id: 'night_owl', title: 'Scholar', description: 'Generate 50+ AI questions', iconName: 'BookOpen', unlocked: true, unlockedAt: '2026-08-05' },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('study_buddy_user');
    return saved ? JSON.parse(saved) : null; // Require sign-in by default
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('study_buddy_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('study_buddy_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('study_buddy_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('study_buddy_badges', JSON.stringify(badges));
  }, [badges]);

  const loginUser = (userProfile: UserProfile) => {
    setUser(userProfile);
    setOpenAuthModal(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('study_buddy_user');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginUser,
        logout,
        badges,
        updateProfile,
        openAuthModal,
        setOpenAuthModal,
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
