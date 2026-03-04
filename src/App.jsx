import { useLocation, Navigate, Route, Routes } from 'react-router-dom';
import { Auth, Header } from '@components';
import { AuthProvider } from '@contexts';
import { Menu, Game } from '@pages';

const VALID_PATHS = new Set([
  '/',
  '/genshin-impact',
  '/honkai-star-rail',
  '/wuthering-waves',
  '/zenless-zone-zero',
]);

export default function App() {
  const location = useLocation();
  if (!VALID_PATHS.has(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/:gamePath" element={<Game />} />
      </Routes>
    </AuthProvider>
  );
};
