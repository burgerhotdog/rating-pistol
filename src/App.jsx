import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Menu from './Pages/Menu';
import LoginStatus from './Components/LoginStatus';

import GI from './Pages/GI';
import HSR from './Pages/HSR';
import ZZZ from './Pages/ZZZ';
import WUWA from './Pages/WUWA';

import './App.css';

function App() {
  // login state
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  async function storeUid() {
    if (auth.currentUser) {
      const email = auth.currentUser.email || "guest";
      await setDoc(doc(db, "users", auth.currentUser.uid), { email }, { merge: true });
    }
  }

  // update login state based on auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.isAnonymous) {
          setIsLoggedIn(false); // anonymous auth -> not logged in
        } else {
          setIsLoggedIn(true); // google auth -> logged in
        }
        await storeUid();
      } else {
        if (isLoggedIn === null){
          if (!auth.currentUser || !auth.currentUser.isAnonymous) {
            // If there's no anonymous user, do anonymous auth
            await signInAnonymously(auth);
          }
          setIsLoggedIn(false);
          await storeUid();
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // loading... message for first time visit
  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <LoginStatus isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/menu" element={<Menu />} />
        
        <Route path="/gi" element={<GI />} />
        <Route path="/hsr" element={<HSR />} />
        <Route path="/zzz" element={<ZZZ />} />
        <Route path="/wuwa" element={<WUWA />} />
        
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
