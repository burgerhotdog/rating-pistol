import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { Button, Box } from '@mui/material';

const SignOutButton = () => {
  const navigate = useNavigate();
  const email = auth.currentUser.email;

  const handleSignOut = async () => {
    await signOut(auth);
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
      <Button onClick={handleSignOut}>
        Sign Out
      </Button>
    </Box>
  );
};
  
export default SignOutButton;
