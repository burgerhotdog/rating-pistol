import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom';
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
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<GameIdGuard />}>
              <Route path="/:gameId/:charId?" element={<GamePage />} />
            </Route>
          </Routes>
        </BuildProvider>
      </UserProvider>
    </AuthProvider>
  );
}
