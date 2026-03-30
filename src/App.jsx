import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import { Header } from '@/components';
import { AuthProvider, BuildProvider, UserProvider } from '@/contexts';
import { GamePage, HomePage } from '@/pages';

const GAME_PATHS = new Set([
  'genshin-impact',
  'honkai-star-rail',
  'wuthering-waves',
  'zenless-zone-zero',
]);

export default function App() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const gamePath = pathSegments[0] ?? null;

  const isHome = pathSegments.length === 0;
  const isGame = GAME_PATHS.has(gamePath) && pathSegments.length < 3;
  const isValidUrl = isHome || isGame;

  if (!isValidUrl) return <Navigate to="/" replace />;

  return (
    <AuthProvider>
      <UserProvider>
        <BuildProvider>
          <Container
            maxWidth="lg"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100dvh',
            }}
          >
            <Header gamePath={gamePath} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/:gameId/:charId?" element={<GamePage />} />
            </Routes>
          </Container>
        </BuildProvider>
      </UserProvider>
    </AuthProvider>
  );
}
