import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header } from '@/components';
import { Navbar } from '@/components/ConfigPanel';
import { useBuild, useUser } from '@/contexts';
import { CHARACTER } from '@/data';
import { Content } from '@/pages';

export const GamePage = () => {
  const { gameId, charId } = useParams();

  const builds = useBuild().getBuilds(gameId);
  const pinned = useUser().pinnedIds[gameId];

  const sorted = useMemo(() => Object.keys(builds).sort((a, b) => {
    if (a === pinned) return -1;
    if (b === pinned) return 1;

    const aIndex = CHARACTER[gameId][a].version;
    const bIndex = CHARACTER[gameId][b].version;

    return bIndex - aIndex;
  }), [gameId, builds, pinned]);

  // Navigate guard against invalid charIds
  if (charId && (!CHARACTER[gameId][charId] || !builds[charId])) {
    return <Navigate to={`/${gameId}`} replace />;
  }

  if (!charId && sorted.length) {
    return <Navigate to={`/${gameId}/${sorted[0]}`} replace />;
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          gap: 1,
          pb: 4,
        }}
      >
        <Navbar sorted={sorted} />
        {charId && <Content key={`${gameId}-${charId}`} />}
      </Box>
    </>
  );
};
