import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firebaseSignIn, firebaseSignOut, firebaseGetUser, firebaseSetUser } from '@/firebase';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
      if (newUser) {
        const { uid, email } = newUser;
        const snapshot = await firebaseGetUser(uid);
        if (!snapshot.exists()) {
          firebaseSetUser(uid, 'email', email);
          firebaseSetUser(uid, 'savedUids', {});
        }
        setUser(newUser);
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const handleAuth = () => {
    setIsAuthLoading(true);
    if (user) firebaseSignOut();
    else firebaseSignIn();
  };

  const userId = user?.uid ?? null;
  const userEmail = user?.email ?? null;

  return (
    <AuthContext.Provider
      value={{
        userId,
        userEmail,
        handleAuth,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
