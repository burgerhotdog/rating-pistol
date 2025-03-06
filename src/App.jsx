import React, { useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { auth } from "./firebase";
import Auth from "./components/Auth";
import MenuPage from "./components/MenuPage";
import GamePage from "./components/GamePage";

function App() {
  const [user, setUser] = useState(auth.currentUser);

  return (
    <HashRouter>
      <Auth user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/genshin-impact" element={<GamePage user={user} gameType="GI" />} />
        <Route path="/honkai-star-rail" element={<GamePage user={user} gameType="HSR" />} />
        <Route path="/wuthering-waves" element={<GamePage user={user} gameType="WW" />} />
        <Route path="/zenless-zone-zero" element={<GamePage user={user} gameType="ZZZ" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
