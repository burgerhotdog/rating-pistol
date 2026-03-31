import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import { Header } from '@/components';
import { AuthProvider, BuildProvider, UserProvider } from '@/contexts';
import { GamePage, HomePage } from '@/pages';
import { VERSION } from '@/lookups';

export default function App() {
  const segments = useLocation().pathname.split('/').filter(Boolean);
  const gameId = segments[0];
  const characterId = segments[1];

  const isHome = !segments.length;
  const isGame = VERSION[gameId] && segments.length < 3;
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
            <Header gameId={gameId} />
            <Routes>
              <Route
                path="/"
                element={<HomePage />}
              />
              <Route
                path="/:gameId/:characterId?"
                element={<GamePage />}
              />
            </Routes>
          </Container>
        </BuildProvider>
      </UserProvider>
    </AuthProvider>
  );
}
