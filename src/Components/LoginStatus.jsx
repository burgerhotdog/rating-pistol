import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signInAnonymously, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Button, Box } from '@mui/material';

const LoginStatus = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const email = isLoggedIn ? auth.currentUser.email : "(not signed in)";

  const handleSignIn = async () => {
    await signOut(auth);
    await signInWithPopup(auth, new GoogleAuthProvider());
    navigate('/menu');
  };

  const handleSignOut = async () => {
    await signOut(auth);
    await signInAnonymously(auth);
    navigate('/menu');
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
      <span style={{ marginRight: '10px' }}>{email}</span>
      <Button onClick={isLoggedIn ? handleSignOut : handleSignIn}>
        {isLoggedIn ? "Sign Out" : "Sign In"}
      </Button>
    </Box>
  );
};
  
export default LoginStatus;
