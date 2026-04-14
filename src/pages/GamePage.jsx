import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import {
  Bar,
  Sidebar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
  TeamConfig,
} from '@/components';
import { useBuild } from "@/contexts";
import { CHARACTERS } from "@/data";
import { useSimulation, useTeam } from '@/hooks';
import { computeDamage } from "@/utils";

export const GamePage = ({ gameId, characterId }) => {
  const build = useBuild().getBuilds(gameId)[characterId];
  const { calcs } = CHARACTERS[gameId][characterId] ?? {};
  const [calcsIndex, setCriteriaIndex] = useState(0);
  const { team, updateTeam } = useTeam(gameId, characterId, calcsIndex);

  const rating = build && calcs
    ? computeDamage(gameId, characterId, build, calcs[calcsIndex], team)
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
          build={build}
          team={team}
        />
        <TeamConfig
          gameId={gameId}
          team={team}
          updateTeam={updateTeam}
        />
      </Stack>

      {calcs && (
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
