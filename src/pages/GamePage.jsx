import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import {
  Sidebar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
  Bar,
} from '@/components';
import { computeRating } from '@/utils';
import { useCurrent, useSimulation } from '@/hooks';

const GamePage = () => {
  const { gameId, characterId } = useParams();
  const { build, data, criteria } = useCurrent();

  const rating = build && criteria ? computeRating(gameId, characterId, build, criteria[0]) : null;
  const criteriaIndex = 0;
  const [buffs, setBuffs] = useState({});

  const { completed, total, progress, weeklyRatings, finalStats, isLoading } = useSimulation(criteriaIndex, buffs);

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
      <Sidebar />
      <StatsPanel />
      {criteria && (
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Bar completed={completed} />
          <CustomLineChart
            weeklyRatings={weeklyRatings}
            rating={rating}
            isLoading={isLoading}
          />

          <Box display="flex" gap={1} sx={{ flex: 1 }}>
            <CustomRadarChart
              charId={characterId}
              build={build}
              combinedSimEquips={finalStats}
              isLoading={isLoading}
            />

            <CustomTable
              build={build}
              rating={rating}
              buffs={buffs}
              isLoading={isLoading}
            />
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default GamePage;
