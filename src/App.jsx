import React, { useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { auth } from "./firebase";
import Auth from "./components/Auth";
import MenuPage from "./components/MenuPage";
import GamePage from "./components/GamePage";

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

function App() {
  const [user, setUser] = useState(auth.currentUser);

  return (
    <ErrorBoundary>
      <HashRouter>
        <Auth user={user} setUser={setUser} />
        <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/genshin-impact" element={<GamePage gameId="gi" userId={user?.uid}  />} />
        <Route path="/honkai-star-rail" element={<GamePage gameId="hsr" userId={user?.uid} />} />
        <Route path="/wuthering-waves" element={<GamePage gameId="ww" userId={user?.uid} />} />
        <Route path="/zenless-zone-zero" element={<GamePage gameId="zzz" userId={user?.uid} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
};

export default App;
