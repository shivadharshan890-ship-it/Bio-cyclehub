"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { isFirebaseEnabled } from "./db";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";

export interface UserSession {
  uid: string;
  email: string;
  displayName: string;
  isMock: boolean;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserSession>;
  register: (email: string, password: string, name: string) => Promise<UserSession>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<UserSession>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize and listen to Auth state changes
  useEffect(() => {
    if (isFirebaseEnabled) {
      const auth = getAuth();
      const unsubscribe = auth.onAuthStateChanged((fbUser) => {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || "",
            displayName: fbUser.displayName || "User",
            isMock: false
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Mock local storage auth listener
      const current = localStorage.getItem("bc_current_user");
      if (current) {
        try {
          setUser(JSON.parse(current));
        } catch {
          setUser(null);
        }
      } else {
        // Create a default mock user for immediate use if they don't sign in
        const defaultMockUser: UserSession = {
          uid: "demo-student-123",
          email: "student@biocyclehub.edu",
          displayName: "Demo Student",
          isMock: true
        };
        localStorage.setItem("bc_current_user", JSON.stringify(defaultMockUser));
        setUser(defaultMockUser);
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<UserSession> => {
    setLoading(true);
    try {
      if (isFirebaseEnabled) {
        const auth = getAuth();
        const credentials = await signInWithEmailAndPassword(auth, email, password);
        const loggedUser: UserSession = {
          uid: credentials.user.uid,
          email: credentials.user.email || "",
          displayName: credentials.user.displayName || "User",
          isMock: false
        };
        setUser(loggedUser);
        setLoading(false);
        return loggedUser;
      } else {
        // Mock Login
        const storedUsersStr = localStorage.getItem("bc_mock_users") || "[]";
        const storedUsers = JSON.parse(storedUsersStr);
        const matched = storedUsers.find((u: any) => u.email === email && u.password === password);
        
        if (email === "student@biocyclehub.edu" || matched) {
          const loggedUser: UserSession = {
            uid: matched ? matched.uid : "demo-student-123",
            email: email,
            displayName: matched ? matched.name : "Demo Student",
            isMock: true
          };
          localStorage.setItem("bc_current_user", JSON.stringify(loggedUser));
          setUser(loggedUser);
          setLoading(false);
          return loggedUser;
        } else {
          throw new Error("Invalid email or password. Hint: You can use student@biocyclehub.edu with any password for instant access, or click Sign Up.");
        }
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<UserSession> => {
    setLoading(true);
    try {
      if (isFirebaseEnabled) {
        const auth = getAuth();
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credentials.user, { displayName: name });
        const newUser: UserSession = {
          uid: credentials.user.uid,
          email: credentials.user.email || "",
          displayName: name,
          isMock: false
        };
        setUser(newUser);
        setLoading(false);
        return newUser;
      } else {
        // Mock Sign-Up
        const storedUsersStr = localStorage.getItem("bc_mock_users") || "[]";
        const storedUsers = JSON.parse(storedUsersStr);
        
        if (storedUsers.some((u: any) => u.email === email)) {
          throw new Error("Email already registered.");
        }
        
        const mockUid = "mock-" + Math.random().toString(36).substr(2, 9);
        const newUser: UserSession = {
          uid: mockUid,
          email: email,
          displayName: name,
          isMock: true
        };
        
        storedUsers.push({ uid: mockUid, email, password, name });
        localStorage.setItem("bc_mock_users", JSON.stringify(storedUsers));
        localStorage.setItem("bc_current_user", JSON.stringify(newUser));
        
        // Seed initial progress for this user
        const initialProgress = {
          xp: 20,
          streak: 1,
          lastActive: new Date().toISOString().split("T")[0],
          completedPathways: [],
          badges: ["welcome"],
          quizScores: [],
          weeklyActivity: [0, 0, 0, 0, 1, 0, 0],
        };
        localStorage.setItem(`bc_progress_${mockUid}`, JSON.stringify(initialProgress));
        
        setUser(newUser);
        setLoading(false);
        return newUser;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      if (isFirebaseEnabled) {
        const auth = getAuth();
        await fbSignOut(auth);
      } else {
        localStorage.removeItem("bc_current_user");
      }
      setUser(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    if (isFirebaseEnabled) {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
    } else {
      // Mock password reset
      console.log(`Mock reset password email requested for: ${email}`);
      return new Promise((resolve) => setTimeout(resolve, 800));
    }
  };

  const loginWithGoogle = async (): Promise<UserSession> => {
    setLoading(true);
    try {
      if (isFirebaseEnabled) {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
          prompt: 'select_account'
        });
        const credentials = await signInWithPopup(auth, provider);
        const loggedUser: UserSession = {
          uid: credentials.user.uid,
          email: credentials.user.email || "",
          displayName: credentials.user.displayName || "Google User",
          isMock: false
        };
        setUser(loggedUser);
        setLoading(false);
        return loggedUser;
      } else {
        // Mock Google Login
        const mockGoogleUser: UserSession = {
          uid: "google-mock-999",
          email: "google.student@biocyclehub.edu",
          displayName: "Google Student",
          isMock: true
        };
        localStorage.setItem("bc_current_user", JSON.stringify(mockGoogleUser));
        setUser(mockGoogleUser);
        setLoading(false);
        return mockGoogleUser;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        resetPassword,
        loginWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
