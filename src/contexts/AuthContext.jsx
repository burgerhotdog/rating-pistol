import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, fbSignIn, fbSignOut, fbGetUser, fbSetUser } from '@/firebase';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
      if (newUser) {
        const { uid, email } = newUser;
        const snapshot = await fbGetUser(uid);
        if (!snapshot.exists()) fbSetUser(uid, 'email', email);
        setUser(newUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const handleAuth = () => {
    setIsLoading(true);
    if (user) fbSignOut();
    else fbSignIn();
  };

  return (
    <AuthContext.Provider value={{ user, handleAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
