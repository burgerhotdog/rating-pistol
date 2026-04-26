import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { AuthProvider, BuildProvider, UserProvider } from '@/contexts';
import { VERSION } from '@/data';
import { GamePage, HomePage } from '@/pages';

const GameIdGuard = () => {
  const { gameId } = useParams();
  if (!VERSION[gameId]) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default function App() {
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
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route element={<GameIdGuard />}>
                <Route path="/:gameId/:characterId?" element={<GamePage />} />
              </Route>
            </Routes>
          </Container>
        </BuildProvider>
      </UserProvider>
    </AuthProvider>
  );
}
