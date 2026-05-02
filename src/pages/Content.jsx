import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import {
  Bar,
  StatsPanel,
  BenchmarkProgress,
  CustomRadarChart,
  SubstatPriority,
  DamageBreakdown,
} from '@/components';
import { useSimulation, useTeam } from '@/hooks';

export const Content = () => {
  const { characterId } = useParams();
  const { team, updateTeam } = useTeam();

  const {
    error,
    completed = 0,
    weeklyScores,
    finalStats,
    weeklyDistribution,
    isLoading,
    diff,
    simCharacter,
    teamFinalStats,
    actionMap,
    actionMapsWithSub,
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

      {(!error && simCharacter === characterId) && (
        isLoading ? (
          diff ? (
            <Bar key={characterId} completed={completed} diff={diff} />
          ) : (
            <Bar completed={completed} diff={1} />
          )
        ) : (
          <Box display="flex" flexDirection="column" sx={{ flex: 1, minHeight: 0 }}>
            <Box display="flex" flexDirection="column" sx={{ flex: 1, minHeight: 250 }}>
              <BenchmarkProgress
                weeklyScores={weeklyScores}
                weeklyDistribution={weeklyDistribution}
                isLoading={isLoading}
                teamFinalStats={teamFinalStats}
                team={team}
                actionMap={actionMap}
              />
            </Box>

            <Box display="flex" flexDirection="row" sx={{ flex: 1, minHeight: 100, mt: 1 }}>
              <CustomRadarChart
                combinedSimEquips={finalStats}
                isLoading={isLoading}
              />
              <DamageBreakdown
                actionMap={actionMap}
              />
            </Box>

            <Box display="flex" flexDirection="row" sx={{ flex: 1, minHeight: 100, mt: 1 }}>
              <SubstatPriority
                isLoading={isLoading}
                actionMap={actionMap}
                actionMapsWithSub={actionMapsWithSub}
              />
            </Box>
          </Box>
        )
      )}
    </Box>
  );
};
