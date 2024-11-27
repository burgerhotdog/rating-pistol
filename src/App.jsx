import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { setPersistence, browserLocalPersistence, signInAnonymously, signInWithPopup, GoogleAuthProvider , signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import SignInStatus from './Components/SignInStatus';
import Menu from './Pages/Menu';

import GI from './Pages/GI';
import HSR from './Pages/HSR';
import ZZZ from './Pages/ZZZ';
import WUWA from './Pages/WUWA';

import './App.css';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(null);
  const navigate = useNavigate();

  // function to store uid
  async function storeUid() {
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const email = auth.currentUser.email ? { email: auth.currentUser.email } : {};
      await setDoc(doc(db, "users", uid), email, { merge: true });
    }
  }

  // auth on initial page load
  useEffect(() => {
    const initialAuth = async () => {
      await setPersistence(auth, browserLocalPersistence);
      if (auth.currentUser) {
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

  return (
    <>
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
    </>
  );
}

export default App;
