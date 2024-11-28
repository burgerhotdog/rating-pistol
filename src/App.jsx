import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { setPersistence, browserLocalPersistence, signInAnonymously, signInWithPopup, GoogleAuthProvider , signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import SignInStatus from './Components/SignInStatus';
import Menu from './Components/Menu';

import GI from './Components/Games/GI';
import HSR from './Components/Games/HSR';
import ZZZ from './Components/Games/ZZZ';
import WUWA from './Components/Games/WUWA';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [uid, setUid] = useState(null);
  const navigate = useNavigate();

  // function to store uid to state and db
  async function storeUid() {
    if (auth.currentUser) {
      setUid(auth.currentUser.uid);
      const email = auth.currentUser.email ? { email: auth.currentUser.email } : {};
      await setDoc(doc(db, "users", auth.currentUser.uid), email, { merge: true });
    }
  }

  // auth on initial page load
  useEffect(() => {
    const initialAuth = async () => {
      await setPersistence(auth, browserLocalPersistence);
      if (auth.currentUser) {
        await storeUid();
        setIsSignedIn(auth.currentUser.isAnonymous ? false : true);
      } else {
        try {
          await signInAnonymously(auth);
          await storeUid();
          setIsSignedIn(false);
        } catch (error) {
          console.error("initial load fail:", error);
        }
      }
      navigate('/menu');
    };
    initialAuth();
  }, []);

  // function for sign-in
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      await storeUid();
      setIsSignedIn(true);
      navigate('/menu');
    } catch (error) {
      if (error.code === "auth/cancelled-popup-request" || error.code === "auth/popup-closed-by-user") {
        console.warn("sign-in popup closed by user");
      } else {
        console.error("sign-in failed:", error);
        alert("An error occurred during Sign-In attempt. Please try again.");
      }
    }
  };

  // function for sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await signInAnonymously(auth);
      await storeUid();
      setIsSignedIn(false);
      navigate('/menu');
    } catch (error) {
      console.error("sign-out error occured:", error);
    }
  };

  // display loading... on initial page load
  if (isSignedIn === null) {
    return <div>Loading...</div>;
  }

  // theme
  const theme = createTheme({
    typography: { allVariants: { color: '#e0e0e0' } },
    components: {
      MuiBox: {
        styleOverrides: {
          root: {
            backgroundColor: '#242424',
            color: 'e0e0e0',
          }
        }
      },
      MuiTableCell: { styleOverrides: { root: { color: '#e0e0e0' } } },
      MuiSelect: {
        styleOverrides: {
          root: { color: '#e0e0e0' },
          icon: { color: '#e0e0e0' }
        }
      },
      MuiMenu: { styleOverrides: { paper: { backgroundColor: '#333333' } } }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <SignInStatus 
        isSignedIn={isSignedIn}
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
      />
      <Routes>
        <Route path="/menu" element={<Menu />} />
        
        <Route path="/gi" element={<GI />} />
        <Route path="/hsr" element={<HSR />} />
        <Route path="/zzz" element={<ZZZ />} />
        <Route path="/wuwa" element={<WUWA />} />
        
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
