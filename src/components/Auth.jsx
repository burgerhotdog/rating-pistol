import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@config/firebase";
import { Box, Stack, Button, Typography } from "@mui/material";

const Auth = ({ user, setUser }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
      try {
        if (newUser) {
          const { uid, email } = newUser;

          const userDocRef = doc(db, "users", uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await setDoc(userDocRef, { email }, { merge: true });
          }
  
          setUser(newUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (user) {
        await signOut(auth);
      } else {
        await setPersistence(auth, browserLocalPersistence);
        await signInWithPopup(auth, new GoogleAuthProvider());
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        {user && (
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        )}
        
        <Button
          onClick={handleAuth}
          disabled={isLoading}
          sx={{ filter: "grayscale(100%)" }}
        >
          {user ? "Sign Out" : "Sign In"}
        </Button>
      </Stack>
    </Box>
  );
};
  
export default Auth;
