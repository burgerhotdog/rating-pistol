import { Navigate, useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { Header, Navbar, StatsPanel } from '@/components';
import { CHARACTER } from '@/data';
import { useSortedBuilds, useTeam } from '@/hooks';
import { Charts } from '@/layouts';

const PageLayout = ({ sortedKeys }) => {
  const { team, updateTeam } = useTeam();

  return (
    <>
      <Header />
      <Stack
        direction="row"
        spacing={1}
        sx={{ flex: 1, overflow: 'hidden', pb: 4 }}
      >
        <Navbar sorted={sortedKeys} />
        <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
          <StatsPanel team={team.members} updateTeam={updateTeam}/>
          <Charts team={team} />
        </Stack>
      </Stack>
    </>
  );
};

const GamePage = () => {
  const { gameId, charId } = useParams();
  const { builds, sortedKeys } = useSortedBuilds(gameId);
  const charData = CHARACTER[gameId];

  const isBadCharId = charId && (!charData[charId] || !builds[charId]);
  if (isBadCharId) return (
    <Navigate to={`/${gameId}`} replace />
  );

  if (!charId && sortedKeys.length) return (
    <Navigate to={`/${gameId}/${sortedKeys[0]}`} replace />
  );

  return (
    <PageLayout key={`${gameId}-${charId}`} sortedKeys={sortedKeys} />
  );
};

export default GamePage;
