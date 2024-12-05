import React, { useState, useEffect } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Menu from './Components/Menu';
import SignInOut from './Components/SignInOut';
import GenshinImpact from './Components/GenshinImpact/GenshinImpact';
import HonkaiStarRail from './Components/HonkaiStarRail/HonkaiStarRail';
import ZenlessZoneZero from './Components/ZenlessZoneZero/ZenlessZoneZero';
import WutheringWaves from './Components/WutheringWaves/WutheringWaves';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [uid, setUid] = useState(null);

  // update state and store uid when auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await setDoc(doc(db, "users", user.uid), { email: user.email }, { merge: true });
        setIsSignedIn(true);
        setUid(user.uid);
      } else {
        setIsSignedIn(false);
        setUid(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // display loading... on initial page load
  if (isLoading == true) {
    return <div>Loading...</div>;
  }

  return (
    <HashRouter>
      <SignInOut 
        isSignedIn={isSignedIn}
      />
      <Routes>
        <Route path="/menu" element={<Menu />} />
        <Route path="/gi" element={<GenshinImpact uid={uid} />} />
        <Route path="/hsr" element={<HonkaiStarRail uid={uid} />} />
        <Route path="/zzz" element={<ZenlessZoneZero uid={uid} />} />
        <Route path="/wuwa" element={<WutheringWaves uid={uid} />} />
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
