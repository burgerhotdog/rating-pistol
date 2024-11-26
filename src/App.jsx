import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';  // Import onAuthStateChanged
import { auth } from './firebase';  // Import your Firebase auth object
import Login from './Login';
import Menu from './Menu2';
import GI from './GI';
import HSR from './HSR';
import ZZZ from './ZZZ';
import WUWA from './WUWA';
import './App.css';
import Logout from './Logout';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);  // User is logged in
      } else {
        setIsLoggedIn(false);  // No user, logged out
      }
    });

    return () => unsubscribe();  // Cleanup listener on unmount
  }, []);

  return (
    <Router>
      {isLoggedIn && <Logout setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/menu" replace /> : <Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/menu"
          element={isLoggedIn ? <Menu /> : <Navigate to="/login" replace />}
        />
        <Route 
          path="/gi" 
          element={isLoggedIn ? <GI /> : <Navigate to="/login" replace />}
        />
        <Route 
          path="/hsr" 
          element={isLoggedIn ? <HSR /> : <Navigate to="/login" replace />}
        />
        <Route 
          path="/zzz" 
          element={isLoggedIn ? <ZZZ /> : <Navigate to="/login" replace />}
        />
        <Route 
          path="/wuwa" 
          element={isLoggedIn ? <WUWA /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;