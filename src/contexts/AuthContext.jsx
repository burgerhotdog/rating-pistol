import { createContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '@/firebase';

const provider = new GoogleAuthProvider();

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user || null);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function signIn() {
    setIsAuthLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Sign-in failed', err);
    }
  };

  async function signOut() {
    setIsAuthLoading(true);
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign-out failed', err);
    }
  };

  const userId = user?.uid ?? null;
  const userEmail = user?.email ?? null;

  return (
    <AuthContext.Provider
      value={{
        userId,
        userEmail,
        signIn,
        signOut,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
