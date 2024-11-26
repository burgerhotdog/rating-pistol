import React from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { Button, Box } from '@mui/material';

const Logout = () => {
  const navigate = useNavigate();

  const email = auth.currentUser.isAnonymous ? 'Guest User' : auth.currentUser.email;

  // handle logout
  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
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
        {auth.currentUser.isAnonymous ? 'Sign in' : 'Sign Out'}
      </Button>
    </Box>
  );
};
  
export default Logout;
