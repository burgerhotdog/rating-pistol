import React from 'react';
import { signInWithPopup, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';

const Login = () => {
  // handle google login
  const handleSignInGoogle = async () => {
    signInWithPopup(auth, new GoogleAuthProvider());
    useNavigate('/menu');
  };

  // handle guest login
  const handleSignInGuest = async () => {
    await signInAnonymously(auth);
    useNavigate('/menu');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        sx={{ textAlign: 'center' }}
      >
        <Typography variant="h3" gutterBottom>Gacha Manager</Typography>
        <Typography variant="subtitle1">Sign in to save your data.</Typography>

        {/* google button */}
        <Button variant="contained" onClick={handleSignInGoogle} sx={{ textTransform: 'none' }}>
          Sign in with Google
        </Button>

        {/* guest button */}
        <Button variant="contained" onClick={handleSignInGuest} sx={{ textTransform: 'none' }}>
          Continue as Guest
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
