import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header, Navbar } from '@/components';
import { useBuild, useUser } from '@/contexts';
import { CHARACTER } from '@/data';
import { Content } from '@/pages';

export const GamePage = () => {
  const { gameId, characterId } = useParams();

  const builds = useBuild().getBuilds(gameId);
  const pinned = useUser().pinnedIds[gameId];

  const sorted = useMemo(() => Object.keys(builds).sort((a, b) => {
    if (a === pinned) return -1;
    if (b === pinned) return 1;

    const aIndex = CHARACTER[gameId][a].version;
    const bIndex = CHARACTER[gameId][b].version;

    return bIndex - aIndex;
  }), [gameId, builds, pinned]);

  // Navigate guard against invalid characterIds
  if (characterId && (!CHARACTER[gameId][characterId] || !builds[characterId])) {
    return <Navigate to={`/${gameId}`} replace />;
  }

  if (!characterId && sorted.length) {
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
        {characterId && <Content key={`${gameId}-${characterId}`} />}
      </Box>
    </>
  );
};
