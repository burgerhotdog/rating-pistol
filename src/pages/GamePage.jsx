import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import {
  Bar,
  Sidebar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
  CustomPieChart,
  MainStatDistribution,
} from '@/components';
import { useBuild } from "@/contexts";
import { CHARACTERS } from "@/data";
import { useSimulation, useTeam } from '@/hooks';
import { computeDamage, computeDamageBreakdown } from "@/utils";

export const GamePage = ({ gameId, characterId }) => {
  const build = useBuild().getBuilds(gameId)[characterId];
  const { calcs } = CHARACTERS[gameId][characterId] ?? {};
  const [calcsIndex, setCriteriaIndex] = useState(0);
  const { team, updateTeam } = useTeam(gameId, characterId, calcsIndex);

  const rating = build && calcs
    ? computeDamage(gameId, characterId, build, calcs[calcsIndex], team)
    : null;

  const breakdown = build && calcs
    ? computeDamageBreakdown(gameId, characterId, build, calcs[calcsIndex], team)
    : [];

  const { completed, weeklyScores, finalStats, mainStatDist, weeklyDistribution, isLoading, elapsed, diff } = useSimulation(gameId, characterId, 0, team);

  const benchmarkWeek = weeklyScores ? weeklyScores.length - 1 : null;

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
      <StatsPanel
          gameId={gameId}
          characterId={characterId}
          build={build}
          team={team}
          updateTeam={updateTeam}
        />

      {calcs ? (
        isLoading ? (
          <Bar completed={completed} elapsed={elapsed} diff={diff} />
        ) : (
          <Box display="flex" flexDirection="column" sx={{ flex: 1, minHeight: 0 }}>
            <Box display="flex" flexDirection="column" sx={{ flex: 1, minHeight: 250 }}>
              <CustomLineChart
                weeklyScores={weeklyScores}
                weeklyDistribution={weeklyDistribution}
                rating={rating}
                isLoading={isLoading}
                gameId={gameId}
                characterId={characterId}
              />
            </Box>

            <Box display="flex" flexDirection="row" sx={{ flex: 2, minHeight: 300, mt: 1 }}>
              <Box flex={3} display="flex" flexDirection="column" minWidth={0} gap={1}>
                <CustomRadarChart
                  gameId={gameId}
                  characterId={characterId}
                  build={build}
                  combinedSimEquips={finalStats}
                  isLoading={isLoading}
                  benchmarkWeek={benchmarkWeek}
                />

                <MainStatDistribution
                  gameId={gameId}
                  characterId={characterId}
                  mainStatDist={mainStatDist}
                />
              </Box>
              <Box flex={2} minWidth={0} ml={1} display="flex" flexDirection="column" gap={1}>
                {breakdown.length > 0 && (
                  <CustomPieChart breakdown={breakdown} />
                )}
                <CustomTable
                  gameId={gameId}
                  characterId={characterId}
                  build={build}
                  rating={rating}
                  team={team}
                  isLoading={isLoading}
                />
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
