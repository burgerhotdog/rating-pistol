import { useLocation, Navigate, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import { Header } from '@/components';
import { AuthProvider, BuildDataProvider, UserDataProvider } from '@/contexts';
import { GamePage, HomePage } from '@/pages';

const GAME_IDS = new Set([
  'genshin-impact',
  'honkai-star-rail',
  'wuthering-waves',
  'zenless-zone-zero',
]);

export default function App() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const [gameId = ''] = pathSegments;
  const isHome = pathSegments.length === 0;
  const hasValidSegmentCount = pathSegments.length <= 2;
  const hasValidGameId = isHome || GAME_IDS.has(gameId);

  if (!hasValidSegmentCount || !hasValidGameId) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthProvider>
      <UserDataProvider>
        <BuildDataProvider>
          <Container
            maxWidth='lg'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '100dvh',
            }}
          >
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/:gameId/:charId?" element={<GamePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </BuildDataProvider>
      </UserDataProvider>
    </AuthProvider>
  );
};
