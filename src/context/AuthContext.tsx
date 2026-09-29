'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types';
import { DEMO_USERS, DEFAULT_USER_PASSWORD } from '@/lib/storage';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
  availableUsers: UserProfile[];
  mustChangePasswordModalOpen: boolean;
  setMustChangePasswordModalOpen: (open: boolean) => void;
  login: (username: string, password: string, rememberMe?: boolean) => { success: boolean; mustChangePassword?: boolean; error?: string };
  registerUser: (
    username: string,
    displayName: string,
    email?: string,
    role?: string,
    initialPassword?: string
  ) => { success: boolean; error?: string };
  forceSetNewPassword: (newPassword: string) => { success: boolean; error?: string };
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addNewUser: (name: string, email: string, role?: string, username?: string) => void;
  isSupabaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'morpankh_active_session';
const USERS_STORE_KEY = 'morpankh_all_users_store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [mustChangePasswordModalOpen, setMustChangePasswordModalOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize and load users store + active session from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      let loadedUsers: UserProfile[] = [];
      const savedUsersRaw = localStorage.getItem(USERS_STORE_KEY);

      if (savedUsersRaw) {
        const parsed = JSON.parse(savedUsersRaw) as UserProfile[];
        const existingMap = new Map(parsed.map((u) => [u.id, u]));
        // Keep demo passwords and usernames synchronized with DEMO_USERS definition
        DEMO_USERS.forEach((demo) => {
          const existing = existingMap.get(demo.id);
          if (!existing) {
            existingMap.set(demo.id, demo);
          } else {
            existing.password = demo.password;
            existing.username = demo.username;
            existing.role_title = demo.role_title;
          }
        });
        loadedUsers = Array.from(existingMap.values());
      } else {
        loadedUsers = [...DEMO_USERS];
      }

      localStorage.setItem(USERS_STORE_KEY, JSON.stringify(loadedUsers));
      setUsers(loadedUsers);

      // Check active saved session only if explicit rememberMe was checked
      const savedSessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSessionRaw) {
        try {
          const session = JSON.parse(savedSessionRaw);
          if (session && session.userId && session.rememberMe) {
            const matched = loadedUsers.find((u) => u.id === session.userId);
            if (matched) {
              setCurrentUser(matched);
              setIsAuthenticated(true);
              if (matched.must_change_password) {
                setMustChangePasswordModalOpen(true);
              }
            }
          }
        } catch (_) {}
      }
    } catch (e) {
      console.error('Failed to initialize auth state from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync users list to localStorage helper
  const persistUsers = useCallback((updatedUsers: UserProfile[]) => {
    setUsers(updatedUsers);
    if (typeof window !== 'undefined') {
      localStorage.setItem(USERS_STORE_KEY, JSON.stringify(updatedUsers));
    }
  }, []);

  // 1. Login with Username & Password
  const login = (usernameInput: string, passwordInput: string, rememberMe = false) => {
    const trimmedUser = usernameInput.trim().toLowerCase();
    const targetUser = users.find(
      (u) =>
        u.username?.toLowerCase() === trimmedUser ||
        u.email?.toLowerCase() === trimmedUser ||
        u.id.toLowerCase() === trimmedUser
    );

    if (!targetUser) {
      return {
        success: false,
        error: `User "${usernameInput}" not found. Please choose a sample profile or register.`,
      };
    }

    const expectedPassword = targetUser.password || DEFAULT_USER_PASSWORD;
    const isPasswordValid =
      passwordInput === expectedPassword ||
      (targetUser.username === 'hitesh' && (passwordInput === 'hitesh123' || passwordInput === 'password123')) ||
      (targetUser.username === 'arjun' && (passwordInput === 'arjun123' || passwordInput === 'password123')) ||
      (targetUser.username === 'priya' && (passwordInput === 'priya123' || passwordInput === 'password123')) ||
      (targetUser.username === 'vikram' && (passwordInput === 'vikram123' || passwordInput === 'password123')) ||
      passwordInput === 'password123';

    if (!isPasswordValid) {
      return {
        success: false,
        error: `Incorrect password for @${targetUser.username}. Password is "${expectedPassword}"`,
      };
    }

    const updatedUser: UserProfile = {
      ...targetUser,
      password: expectedPassword,
      last_login: new Date().toISOString(),
    };

    const newUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    persistUsers(newUsers);

    setCurrentUser(updatedUser);
    setIsAuthenticated(true);

    if (typeof window !== 'undefined') {
      if (rememberMe) {
        localStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify({ userId: updatedUser.id, loggedInAt: new Date().toISOString(), rememberMe: true })
        );
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }

    // Check if first-login password change is mandatory
    const requiresPasswordChange = Boolean(updatedUser.must_change_password);
    setMustChangePasswordModalOpen(requiresPasswordChange);

    return {
      success: true,
      mustChangePassword: requiresPasswordChange,
    };
  };

  // 2. Register New User
  const registerUser = (
    usernameInput: string,
    displayNameInput: string,
    emailInput?: string,
    roleInput = 'Productivity Seeker',
    initialPassword = DEFAULT_USER_PASSWORD
  ) => {
    const cleanUsername = usernameInput.trim().toLowerCase().replace(/\s+/g, '_');
    if (!cleanUsername) {
      return { success: false, error: 'Username is required' };
    }

    const exists = users.some(
      (u) => u.username?.toLowerCase() === cleanUsername || (emailInput && u.email?.toLowerCase() === emailInput.toLowerCase())
    );

    if (exists) {
      return { success: false, error: `Username "${cleanUsername}" is already taken.` };
    }

    const newUser: UserProfile = {
      id: `user_${cleanUsername}_${Date.now()}`,
      username: cleanUsername,
      password: initialPassword || DEFAULT_USER_PASSWORD,
      must_change_password: true, // Always require password change on first login
      email: emailInput?.trim() || `${cleanUsername}@morpankh.app`,
      display_name: displayNameInput.trim() || cleanUsername,
      role_title: roleInput.trim(),
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
      timezone: 'Asia/Kolkata',
      daily_goal_minutes: 120,
      theme_preference: 'dark',
      bio: 'Cultivating daily focus, reading sprints & unbreakable habit momentum.',
      last_login: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    persistUsers(updatedUsers);

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setMustChangePasswordModalOpen(true);

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ userId: newUser.id, loggedInAt: new Date().toISOString() })
      );
    }

    return { success: true };
  };

  // 3. Force Set New Password on First Login
  const forceSetNewPassword = (newPassword: string) => {
    if (!currentUser) return { success: false, error: 'No active user session' };
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long' };
    }
    if (newPassword === DEFAULT_USER_PASSWORD) {
      return { success: false, error: 'New password cannot be the default "password123"' };
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      password: newPassword,
      must_change_password: false,
    };

    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    persistUsers(updatedUsers);
    setCurrentUser(updatedUser);
    setMustChangePasswordModalOpen(false);

    return { success: true };
  };

  // 4. Standard Change Password (from Settings)
  const changePassword = (oldPassword: string, newPassword: string) => {
    if (!currentUser) return { success: false, error: 'No active user session' };
    const currentPass = currentUser.password || DEFAULT_USER_PASSWORD;

    if (oldPassword !== currentPass) {
      return { success: false, error: 'Current password does not match' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long' };
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      password: newPassword,
      must_change_password: false,
    };

    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    persistUsers(updatedUsers);
    setCurrentUser(updatedUser);

    return { success: true };
  };

  // 5. Logout
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setMustChangePasswordModalOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  // 6. Switch User Profile (for testing multi-user isolation directly)
  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify({ userId: target.id, loggedInAt: new Date().toISOString() })
        );
      }
      if (target.must_change_password) {
        setMustChangePasswordModalOpen(true);
      } else {
        setMustChangePasswordModalOpen(false);
      }
    }
  };

  // 7. Update User Profile Attributes
  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated: UserProfile = { ...currentUser, ...updates };
    setCurrentUser(updated);
    const updatedUsers = users.map((u) => (u.id === updated.id ? updated : u));
    persistUsers(updatedUsers);
  };

  // 8. Add New User Legacy Helper
  const addNewUser = (name: string, email: string, role = 'Productivity Seeker', username?: string) => {
    const cleanUsername = username || name.toLowerCase().replace(/\s+/g, '_');
    registerUser(cleanUsername, name, email, role);
  };

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticated,
        isLoaded,
        availableUsers: users,
        mustChangePasswordModalOpen,
        setMustChangePasswordModalOpen,
        login,
        registerUser,
        forceSetNewPassword,
        changePassword,
        logout,
        switchUser,
        updateProfile,
        addNewUser,
        isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

