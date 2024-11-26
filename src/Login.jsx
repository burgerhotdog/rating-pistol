import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { signInWithPopup, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const signInGoogle = async () => {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    console.log('User signed in with Google:', result.user);
    setIsLoggedIn(true);
    navigate('/menu');
  };

  const signInGuest = async () => {
    const result = await signInAnonymously(auth);
    console.log('User signed in as guest:', result.user);
    setIsLoggedIn(true);
    navigate('/menu');
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
        <Typography variant="h4" gutterBottom>
          Welcome! Sign in to continue.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={signInGoogle}
          sx={{ textTransform: 'none' }}
        >
          Sign in with Google
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={signInGuest}
          sx={{ textTransform: 'none' }}
        >
          Continue as Guest
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
