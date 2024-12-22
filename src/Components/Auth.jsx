import React, { useEffect, useState } from 'react';
import {
  browserLocalPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Box, Button, Typography } from '@mui/material';

import { auth, db } from '../firebase';

const Auth = ({ setUid }) => {
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Updates uid when user signs in or out
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          await setDoc(userDocRef, { email: user.email }, { merge: true });
        }

        setUid(user.uid);
        setEmail(user.email);
      } else {
        // User is signed out
        setUid(null);
        setEmail(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sign in button
  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error('handleSignIn: ', error);
      setIsLoading(false);
    }
  };

  // Sign out button
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('handleSignOut: ', error);
      setIsLoading(false);
    }
  };
  
  return (
    <Box sx={{
      position: 'fixed',
      top: 8,
      right: 8,
    }}>
      {isLoading ? (
        <Box sx= {{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Typography>Loading...</Typography>
        </Box>
      ) : (
      <Box sx= {{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
      }}>
        <Typography variant='button'>
          {email ? email : ''}
        </Typography>

        <Button onClick={email ? handleSignOut : handleSignIn}>
          {email ? 'Sign Out' : 'Sign In'}
        </Button>
      </Box>
      )}
    </Box>
  );
};
  
export default Auth;
