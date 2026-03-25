import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import {
  Sidebar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
} from '@/components';
import { BuildContext, UserContext } from '@/contexts';
import { computeDamage } from '@/utils';
import { CHARACTER_LOOKUP } from '@/lookups';

const GamePage = () => {
  const { gameId, charId } = useParams();
  const [buffs, setBuffs] = useState({});
  const [criteriaIndex, setCriteriaIndex] = useState(0);
  const builds = useContext(BuildContext).buildCollections[gameId] ?? {};
  const pinnedId = useContext(UserContext).pinnedIds[gameId] ?? null;
  const charBuild = builds[charId] ?? null;
  const criteria = CHARACTER_LOOKUP[gameId][charId]?.CRITERIA;
  const rating = (criteria && charBuild?.weaponId) ? computeDamage(gameId, [charId, charBuild]) : 0;

  const workerRef = useRef(null);
  const [result, setResult] = useState({
    weeklyRatings: null,
    finalStats: null,
    isLoading: false,
  });

  useEffect(() => {
    if (!charBuild || !criteria) {
      setResult({
        weeklyRatings: null,
        finalStats: null,
        isLoading: false,
      });
      return;
    }
  
    setResult(prev => ({ ...prev, isLoading: true }));
  
    workerRef.current?.terminate();
    const worker = new Worker(
      new URL('../workers/simulation.worker.js', import.meta.url),
      { type: 'module' },
    );
    workerRef.current = worker;

    worker.onmessage = ({ data: { weeklyRatings, finalStats } }) => {
      setResult({ weeklyRatings, finalStats, isLoading: false });
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
    };

    worker.postMessage({ gameId, buildEntry: [charId, charBuild], buffs, criteriaIndex });

    return () => {
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
    };
  }, [gameId, charId, charBuild, buffs, criteriaIndex]);

  return (
    <Box
      display="flex"
      sx={{
        overflow: 'hidden',
        pb: 4,
        gap: 2,
        flex: 1,
      }}
    >
      <Sidebar buildKeys={Object.keys(builds)} pinnedId={pinnedId} />
      <StatsPanel id={charId} data={charBuild} />
      {criteria && (
        <Stack spacing={2} sx={{ flex: 1 }}>
          <CustomLineChart
            weeklyRatings={result.weeklyRatings}
            rating={rating}
            isLoading={result.isLoading}
          />

          <Box display='flex' gap={2}>
            <CustomRadarChart
              buildEntry={[charId, charBuild]}
              combinedSimEquips={result.finalStats}
              isLoading={result.isLoading}
            />

            <CustomTable
              build={charBuild}
              rating={rating}
              buffs={buffs}
              isLoading={result.isLoading}
            />
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default GamePage;
