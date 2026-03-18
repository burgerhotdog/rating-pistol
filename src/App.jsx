import { useLocation, Navigate, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import { Header } from '@/components';
import { AuthProvider, BuildDataProvider, UserDataProvider } from '@/contexts';
import { GamePage, HomePage } from '@/pages';

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
              <Route path="/:gameId" element={() => {
                const { gameId } = useParams();
                return (
                  <GamePage gameId={gameId} />
                );
              }} />
            </Routes>
          </Container>
        </BuildDataProvider>
      </UserDataProvider>
    </AuthProvider>
  );
};
