import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import {
  Bar,
  Sidebar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
  TeamConfig,
  CustomPieChart,
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

      {calcs ? (
        isLoading ? (
          <Bar completed={completed} elapsed={elapsed} />
        ) : (
          <Box display="flex" flexDirection="column" sx={{ flex: 1, minHeight: 0 }}>
            <Box display="flex" flexDirection="column" sx={{ flex: 1, minHeight: 250 }}>
              <CustomLineChart
                weeklyScores={weeklyScores}
                rating={rating}
                isLoading={isLoading}
                gameId={gameId}
                characterId={characterId}
              />
            </Box>

            <Box display="flex" flexDirection="row" sx={{ flex: 2, minHeight: 300, mt: 1 }}>
              <Box flex={2} display="flex" flexDirection="column" minWidth={0}>
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
              <Box flex={1} minWidth={0} ml={2} display="flex" flexDirection="column">
                <CustomPieChart />
              </Box>
            </Box>
          </Box>
        )
      ) : (
        <Typography textAlign="center" sx={{ flex: 1 }}>
          Simulation data is not available for this character
        </Typography>
      )}
    </Box>
  );
};
