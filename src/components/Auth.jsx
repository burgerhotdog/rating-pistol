import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { Box, Button, Typography } from '@mui/material';

export default ({ user, setUser }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
      try {
        if (newUser) {
          const { uid, email } = newUser;

          const userDocRef = doc(db, 'users', uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await setDoc(userDocRef, { email }, { merge: true });
          }
  
          setUser(newUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (user) {
        await signOut(auth);
      } else {
        await setPersistence(auth, browserLocalPersistence);
        await signInWithPopup(auth, new GoogleAuthProvider());
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <Box
      display="flex"
      alignItems="center"
      position="fixed"
      top={16}
      right={16}
      zIndex={1000}
      gap={1}
    >
      {user && (
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      )}

      <Button
        onClick={handleAuth}
        disabled={isLoading}
        sx={{ filter: 'grayscale(100%)' }}
      >
        {user ? 'Sign Out' : 'Sign In'}
      </Button>
    </Box>
  );
};
