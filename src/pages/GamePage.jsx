import { useMemo, useState } from 'react';
import { Box, Stack } from '@mui/material';
import {
  Sidebar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
  Bar,
} from '@/components';
import { TeamConfig } from '@/components/TeamConfig';
import { computeDamage2 } from '@/utils';
import { useCurrent, useSimulation, useTeam } from '@/hooks';

export const GamePage = ({ gameId, characterId }) => {
  const { build, criteria } = useCurrent();
  const [criteriaIndex, setCriteriaIndex] = useState(0);
  const { team, updateTeam } = useTeam(gameId, characterId, criteriaIndex);

  const rating = build && criteria
    ? computeDamage2(gameId, characterId, build, criteria[criteriaIndex], team)
    : null;

  const { completed, weeklyScores, finalStats, isLoading, elapsed } = useSimulation(gameId, characterId, 0, team);

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
        gameId={gameId}
        characterId={characterId}
      />
      <Stack spacing={1}>
        <StatsPanel
          gameId={gameId}
          characterId={characterId}
        />
        <TeamConfig
          gameId={gameId}
          team={team}
          updateTeam={updateTeam}
        />
      </Stack>

      {criteria && (
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Bar completed={completed} elapsed={elapsed} />
          <CustomLineChart
            weeklyScores={weeklyScores}
            rating={rating}
            isLoading={isLoading}
          />

          <Box display="flex" gap={1} sx={{ flex: 1 }}>
            <CustomRadarChart
              gameId={gameId}
              characterId={characterId}
              build={build}
              combinedSimEquips={finalStats}
              isLoading={isLoading}
            />

            <CustomTable
              gameId={gameId}
              characterId={characterId}
              build={build}
              rating={rating}
              team={team}
              isLoading={isLoading}
            />
          </Box>
        </Stack>
      )}
    </Box>
  );
};
