import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import { Button, Box } from '@mui/material';

const SignInButton = () => {
  const navigate = useNavigate();
  
  const handleSignIn = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
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
      <Button onClick={handleSignIn}>
        Sign In
      </Button>
    </Box>
  );
};
  
export default SignInButton;
