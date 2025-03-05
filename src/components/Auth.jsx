import React, { useEffect, useState } from "react";
import {
  browserLocalPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Box, Stack, Button, Typography } from "@mui/material";
import { auth, db } from "../firebase";

const Auth = ({ setUid }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          await setDoc(userDocRef, { email: user.email }, { merge: true });
        }

        setUid(user.uid);
        setEmail(user.email);
      } else {
        setUid(null);
        setEmail("");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    await setPersistence(auth, browserLocalPersistence);
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut(auth);
  };
  
  return (
    <Box sx={{ position: "fixed", top: 8, right: 8 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="button">
          {email}
        </Typography>
        <Button onClick={email ? handleSignOut : handleSignIn} loading={isLoading}>
          {email ? "Sign Out" : "Sign In"}
        </Button>
      </Stack>
    </Box>
  );
};
  
export default Auth;
