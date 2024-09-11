import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import Cookies from 'js-cookie';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("AuthProvider: Auth state changed", user ? "User logged in" : "No user");
      setUser(user);
      setLoading(false);
      if (user) {
        console.log("AuthProvider: Getting ID token for user");
        user.getIdToken().then((token) => {
          console.log("AuthProvider: Setting auth_token cookie");
          Cookies.set('auth_token', token, { expires: 7 });
        });
      } else {
        console.log("AuthProvider: Removing auth_token cookie");
        Cookies.remove('auth_token');
      }
    });

    return () => {
      console.log("AuthProvider: Unsubscribing from auth state listener");
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log("AuthProvider: Attempting to sign in with Google");
      await signInWithPopup(auth, googleProvider);
      console.log("AuthProvider: Successfully signed in with Google");
    } catch (error) {
      console.error('AuthProvider: Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("AuthProvider: Attempting to sign out");
      await signOut(auth);
      console.log("AuthProvider: Successfully signed out");
      Cookies.remove('auth_token');
    } catch (error) {
      console.error('AuthProvider: Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
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