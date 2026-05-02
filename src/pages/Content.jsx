import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  Bar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
} from '@/components';
import { useSimulation, useTeam } from '@/hooks';

export const Content = () => {
  const { characterId } = useParams();
  const { team, updateTeam } = useTeam();

  const {
    isDisabled,
    completed,
    weeklyScores,
    finalStats,
    weeklyDistribution,
    isLoading,
    diff,
    simCharacter,
    teamFinalStats,
  } = useSimulation(team);

  return (
    <Box
      display="flex"
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
        gap: 1,
      }}
    >
      <StatsPanel
        team={team}
        updateTeam={updateTeam}
      />

      {!isDisabled && (
        simCharacter !== characterId ? (
          <Box display="flex" flexDirection="column" sx={{ flex: 1, minHeight: 0 }}>
            <Typography>Starting simulation...</Typography>
          </Box>
        ) : (
          isLoading ? (
            diff ? (
              <Bar key={characterId} completed={completed} diff={diff} />
            ) : (
              <Bar completed={completed} diff={1} />
            )
          ) : (
            <Box display="flex" flexDirection="column" sx={{ flex: 1, minHeight: 0 }}>
              <Box display="flex" flexDirection="column" sx={{ flex: 1, minHeight: 250 }}>
                <CustomLineChart
                  weeklyScores={weeklyScores}
                  weeklyDistribution={weeklyDistribution}
                  isLoading={isLoading}
                  teamFinalStats={teamFinalStats}
                  team={team}
                />
              </Box>

              <Box display="flex" flexDirection="row" sx={{ flex: 2, minHeight: 300, mt: 1 }}>
                <Box flex={3} display="flex" flexDirection="column" minWidth={0} gap={1}>
                  <CustomRadarChart
                    combinedSimEquips={finalStats}
                    isLoading={isLoading}
                    benchmarkWeek={weeklyScores ? weeklyScores.length - 1 : null}
                  />
                </Box>
                <Box flex={2} minWidth={0} ml={1} display="flex" flexDirection="column" gap={1}>
                  <CustomTable
                    team={team}
                    isLoading={isLoading}
                  />
                </Box>
              </Box>
            </Box>
          )
        )
      )}
    </Box>
  );
};
