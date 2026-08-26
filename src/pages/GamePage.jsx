import { Navigate, useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { Header, Navbar, ConfigPanel, ResultsPanels } from '@/components';
import { CHARACTER } from '@/data';
import { useSortedBuilds, useTeam } from '@/hooks';

const DefaultPage = () => {
  return (
    <Stack sx={{ height: '100dvh', px: 3 }}>
      <Header />
      <Stack sx={{ flex: 1 }}>
        {/* Unfinished */}
      </Stack>
    </Stack>
  );
};

const CharacterPage = () => {
  const [team, setTeam] = useTeam();
  return (
    <Stack sx={{ height: '100dvh', px: 3 }}>
      <Header />
      <Stack
        direction="row"
        spacing={1}
        sx={{ flex: 1, overflow: 'hidden', pb: 3 }}
      >
        <Navbar />
        <ConfigPanel team={team} setTeam={setTeam} />
        <ResultsPanels team={team} />
      </Stack>
    </Stack>
  );
};

const GamePage = () => {
  const { gameId, charId } = useParams();
  const { builds, sortedKeys } = useSortedBuilds();

  if (!charId) {
    return !sortedKeys.length
      ? <DefaultPage key={gameId} />
      : <Navigate to={`/${gameId}/${sortedKeys[0]}`} replace />;
  }

  const validCharId = CHARACTER[gameId][charId] && builds[charId];

  return validCharId
    ? <CharacterPage key={`${gameId}-${charId}`} />
    : <Navigate to={`/${gameId}`} replace />;
};

export default GamePage;
