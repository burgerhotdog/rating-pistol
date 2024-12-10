import React, { useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './Components/Auth';
import Menu from './Components/Menu';
import GenshinImpact from './Components/gi/GenshinImpact';
import HonkaiStarRail from './Components/hsr/HonkaiStarRail';
import ZenlessZoneZero from './Components/zzz/ZenlessZoneZero';
import WutheringWaves from './Components/ww/WutheringWaves';

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
