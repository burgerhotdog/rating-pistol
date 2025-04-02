import React, { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
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
    <Box sx={{ position: "fixed", top: 8, right: 8 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="button">
          {user?.email ?? ""}
        </Typography>
        
        <Button onClick={handleAuth} loading={isLoading}>
          {user ? "Sign Out" : "Sign In"}
        </Button>
      </Stack>
    </Box>
  );
};
  
export default Auth;
