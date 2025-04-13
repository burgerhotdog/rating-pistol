import React, { useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { auth } from "@config/firebase";
import { Menu, Game } from "@pages";
import Auth from "@components/Auth";

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
          <Route path="/" element={<Menu />} />
          <Route
            path="/genshin-impact"
            element={<Game gameId="gi" userId={user?.uid}  />}
          />
          <Route
            path="/honkai-star-rail"
            element={<Game gameId="hsr" userId={user?.uid} />}
          />
          <Route
            path="/wuthering-waves"
            element={<Game gameId="ww" userId={user?.uid} />}
          />
          <Route
            path="/zenless-zone-zero"
            element={<Game gameId="zzz" userId={user?.uid} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
};

export default App;
