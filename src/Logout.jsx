import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Logout = () => {
  // handle logout
  const handleSignOut = async () => {
    await signOut(auth);
    useNavigate('/login');
  };

  return (
    <Button onClick={handleSignOut} style={{ position: 'fixed', top: '10px', right: '10px' }}>
      Sign Out
    </Button>
  );
};
  
export default Logout;
