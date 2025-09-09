import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Box, Button, Typography } from '@mui/material';
import { auth, fbSignIn, fbSignOut, fbGetUser, fbSetUser } from '@/firebase';

export default ({ user, setUser }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
      if (newUser) {
        const { uid, email } = newUser;
        const snapshot = await fbGetUser(uid);
        if (!snapshot.exists()) fbSetUser(uid, 'email', email);
        setUser(newUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = () => {
    setIsLoading(true);
    if (user) fbSignOut();
    else fbSignIn();
  };
  
  return (
    <Box
      display="flex"
      alignItems="center"
      position="fixed"
      top={16}
      right={16}
      zIndex={1000}
      gap={1}
    >
      {user && (
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      )}

      <Button
        onClick={handleAuth}
        disabled={isLoading}
        sx={{ filter: 'grayscale(100%)' }}
      >
        {user ? 'Sign Out' : 'Sign In'}
      </Button>
    </Box>
  );
};
