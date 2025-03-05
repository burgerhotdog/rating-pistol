import React, { useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import MenuPage from "./components/MenuPage";
import GenshinImpact from "./pages/GenshinImpact";
import HonkaiStarRail from "./pages/HonkaiStarRail";
import WutheringWaves from "./pages/WutheringWaves";
import ZenlessZoneZero from "./pages/ZenlessZoneZero";

function App() {
  const [uid, setUid] = useState(null);

  return (
    <HashRouter>
      <Auth setUid={setUid} />
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/genshin-impact" element={<GenshinImpact uid={uid} />} />
        <Route path="/honkai-star-rail" element={<HonkaiStarRail uid={uid} />} />
        <Route path="/wuthering-waves" element={<WutheringWaves uid={uid} />} />
        <Route path="/zenless-zone-zero" element={<ZenlessZoneZero uid={uid} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
