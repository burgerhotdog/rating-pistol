import { Navigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header, Sidebar } from '@/components';
import { CHARACTERS } from '@/data';
import { Content } from '@/pages';

export const GamePage = () => {
  const { gameId, characterId } = useParams();

  // Navigate invalid characterIds to main page
  if (characterId && !CHARACTERS[gameId][characterId]) {
    return <Navigate to={`/${gameId}`} replace />;
  }

  return (
    <>
      <Header />
      <Box
        display="flex"
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          pb: 4,
          gap: 1,
        }}
      >
        <Sidebar />
        {characterId && <Content key={`${gameId}-${characterId}`} />}
      </Box>
    </>
  );
};
