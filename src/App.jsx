import React, { useState, useEffect } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { setPersistence, browserLocalPersistence, onAuthStateChanged, signInWithPopup, GoogleAuthProvider , signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import SignInOut from './Components/SignInOut';
import Menu from './Components/Menu';
import GI from './Components/Games/GI';
import HSR from './Components/Games/HSR';
import ZZZ from './Components/Games/ZZZ';
import WUWA from './Components/Games/WUWA';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // update state and store uid when auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await setDoc(doc(db, "users", user.uid), { email: user.email }, { merge: true });
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  // display loading... on initial page load
  if (isLoading == true) {
    return <div>Loading...</div>;
  }

  return (
    <HashRouter>
      <SignInOut 
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
    </HashRouter>
  );
};

export default App;
