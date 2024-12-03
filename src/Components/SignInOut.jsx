import React from 'react';
import { auth } from '../firebase';
import { Button, Box } from '@mui/material';

const SignInOut = ({ isSignedIn, handleSignIn, handleSignOut }) => {
  const email = isSignedIn ? auth.currentUser.email : "(not signed in)";
  
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
      <span style={{ marginRight: '10px' }}>{email}</span>
      <Button onClick={isSignedIn ? handleSignOut : handleSignIn}>
        {isSignedIn ? "Sign Out" : "Sign In"}
      </Button>
    </Box>
  );
};
  
export default SignInOut;
