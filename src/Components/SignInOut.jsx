import React from 'react';
import { setPersistence, browserLocalPersistence, signInWithPopup, GoogleAuthProvider , signOut } from 'firebase/auth';
import { Button, Box, Typography } from '@mui/material';
import { auth } from '../firebase';

const SignInOut = ({ isSignedIn }) => {
  const email = isSignedIn ? auth.currentUser.email : "(not signed in)";

  const handleSignIn = async () => {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 10,
        right: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <Typography sx={{marginRight: '10px'}}>{email}</Typography>
      <Button onClick={isSignedIn ? handleSignOut : handleSignIn}>
        {isSignedIn ? "Sign Out" : "Sign In"}
      </Button>
    </Box>
  );
};
  
export default SignInOut;
