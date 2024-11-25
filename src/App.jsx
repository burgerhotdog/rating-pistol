import React from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import GI from './components/gi';
import HSR from './components/hsr';
import ZZZ from './components/zzz';
import WUWA from './components/wuwa';
import './App.css'

function App() {
  return (
    <Router>
      <div>
        <div>
          <Link to="/gi">Genshin Impact</Link> |
          <Link to="/hsr"> Honkai Star Rail</Link> |
          <Link to="/zzz"> Zenless Zone Zero</Link> |
          <Link to="/wuwa"> Wuthering Waves</Link>
        </div>

        <Routes>
          <Route path="/gi" element={<GI />} />
          <Route path="/hsr" element={<HSR />} />
          <Route path="/zzz" element={<ZZZ />} />
          <Route path="/wuwa" element={<WUWA />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;