import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

const Logout = ({ setIsLoggedIn }) => {
  const handleSignOut = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    console.log('User signed out');
  };

  return (
    <button onClick={handleSignOut} style={{ position: 'fixed', top: '10px', right: '10px' }}>
      Log Out
    </button>
  );
};
  
export default Logout;
