import React from 'react';
import { auth } from '../firebase';
import { Button, Box } from '@mui/material';

const SignInStatus = ({ isSignedIn, handleSignIn, handleSignOut }) => {
  const email = !isSignedIn ? "(not signed in)" : auth.currentUser.email;
  
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
      <Button onClick={!isSignedIn ? handleSignIn : handleSignOut}>
        {!isSignedIn ? "Sign In" : "Sign Out"}
      </Button>
    </Box>
  );
};
  
export default SignInStatus;
