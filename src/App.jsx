import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { setPersistence, browserLocalPersistence, onAuthStateChanged, signInWithPopup, GoogleAuthProvider , signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import SignInStatus from './Components/SignInStatus';
import Menu from './Components/Menu';

import GI from './Components/Games/GI';
import HSR from './Components/Games/HSR';
import ZZZ from './Components/Games/ZZZ';
import WUWA from './Components/Games/WUWA';
import './App.css';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(null);

  // function to store uid to state and db
  async function storeUid() {
    const email = auth.currentUser.email;
    await setDoc(doc(db, "users", auth.currentUser.uid), { email }, { merge: true });
  }

  // update isSignedIn and store uid on auth change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await setDoc(doc(db, "users", user.uid), { email: user.email }, { merge: true });
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // function for sign-in
  const handleSignIn = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, new GoogleAuthProvider());
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
    await signOut(auth);
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
