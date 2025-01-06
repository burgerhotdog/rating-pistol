import React, { useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import Menu from './components/Menu';
import GenshinImpact from './pages/genshin-impact/GenshinImpact';
import HonkaiStarRail from './pages/honkai-star-rail/HonkaiStarRail';
import ZenlessZoneZero from './pages/zenless-zone-zero/ZenlessZoneZero';
import WutheringWaves from './pages/wuthering-waves/WutheringWaves';

function App() {
  const [uid, setUid] = useState(null);

  return (
    <HashRouter>
      <Auth setUid={setUid} />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/genshin-impact" element={<GenshinImpact uid={uid} />} />
        <Route path="/honkai-star-rail" element={<HonkaiStarRail uid={uid} />} />
        <Route path="/zenless-zone-zero" element={<ZenlessZoneZero uid={uid} />} />
        <Route path="/wuthering-waves" element={<WutheringWaves uid={uid} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
