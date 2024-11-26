import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './Login';
import Logout from './Logout';
import Menu from './Menu';

import GI from './GI';
import HSR from './HSR';
import ZZZ from './ZZZ';
import WUWA from './WUWA';

import './App.css';

function App() {
  // login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // update login state based on auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe(); 
  }, []);

  return (
    <Router>
      {isLoggedIn && <Logout />}
      <Routes>
        {/* login screen */}
        <Route path="/login" element={isLoggedIn ? <Navigate to="/menu" replace /> : <Login />} />

        {/* main menu */}
        <Route path="/menu" element={isLoggedIn ? <Menu /> : <Navigate to="/login" replace />} />
        
        {/* game menus */}
        <Route path="/gi" element={isLoggedIn ? <GI /> : <Navigate to="/login" replace />} />
        <Route path="/hsr" element={isLoggedIn ? <HSR /> : <Navigate to="/login" replace />} />
        <Route path="/zzz" element={isLoggedIn ? <ZZZ /> : <Navigate to="/login" replace />} />
        <Route path="/wuwa" element={isLoggedIn ? <WUWA /> : <Navigate to="/login" replace />} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
