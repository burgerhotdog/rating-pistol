import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import {
  Sidebar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
} from '@/components';
import { useBuild, useUser } from '@/contexts';
import { computeRating } from '@/utils';
import { CHARACTERS } from '@/lookups';

const GamePage = () => {
  const { gameId, charId } = useParams();
  const builds = useBuild().buildCollections[gameId];
  const pinned = useUser().pinnedIds[gameId];

  const build = builds?.[charId];
  const criteria = CHARACTERS[gameId][charId]?.CRITERIA;

  const rating = build && criteria ? computeRating(gameId, charId, build, criteria[0]) : null;

  const workerRef = useRef(null);
  const [workerResult, setWorkerResult] = useState({
    weeklyRatings: null,
    finalStats: null,
    isLoading: false,
  });

  const [buffs, setBuffs] = useState({});

  // Simulation Worker
  useEffect(() => {
    if (!build || !criteria) {
      setWorkerResult({
        weeklyRatings: null,
        finalStats: null,
        isLoading: false,
      });
      return;
    }
  
    setWorkerResult(prev => ({ ...prev, isLoading: true }));
  
    workerRef.current?.terminate();
    const worker = new Worker(
      new URL('../workers/simulation.worker.js', import.meta.url),
      { type: 'module' },
    );
    workerRef.current = worker;

    worker.onmessage = ({ data: { weeklyRatings, finalStats } }) => {
      setWorkerResult({ weeklyRatings, finalStats, isLoading: false });
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
    };

    worker.postMessage({ gameId, charId, build, criteria: criteria[0], buffs });

    return () => {
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
    };
  }, [gameId, charId, build, criteria, buffs]);

  return (
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
      <Sidebar
        buildKeys={builds ? Object.keys(builds) : []}
        pinned={pinned}
      />
      <StatsPanel id={charId} data={build} />
      {criteria && (
        <Stack spacing={1} sx={{ flex: 1 }}>
          <CustomLineChart
            weeklyRatings={workerResult.weeklyRatings}
            rating={rating}
            isLoading={workerResult.isLoading}
          />

          <Box display="flex" gap={1} sx={{ flex: 1 }}>
            <CustomRadarChart
              charId={charId}
              build={build}
              combinedSimEquips={workerResult.finalStats}
              isLoading={workerResult.isLoading}
            />

            <CustomTable
              build={build}
              rating={rating}
              buffs={buffs}
              isLoading={workerResult.isLoading}
            />
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default GamePage;
