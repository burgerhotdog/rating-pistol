import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import {
  Bar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
  CustomPieChart,
} from '@/components';
import { useBuild } from '@/contexts';
import { useSimulation, useTeam } from '@/hooks';
import { computeDamage, computeDamageBreakdown } from '@/utils';

export const Content = () => {
  const { gameId, characterId } = useParams();
  const build = useBuild().getBuilds(gameId)[characterId];
  const { team, updateTeam } = useTeam();
  const isRatingEnabled = gameId === 'wuthering-waves';

  const { completed, weeklyScores, finalStats, weeklyDistribution, teamWeeklyScores, isLoading, diff, simCharacter, teamFinalStats } = useSimulation(gameId, characterId, team, isRatingEnabled);

  const benchmarkWeek = weeklyScores ? weeklyScores.length - 1 : null;

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
        gameId={gameId}
        characterId={characterId}
        build={build}
        team={team}
        updateTeam={updateTeam}
      />

      {isRatingEnabled && (isLoading || simCharacter !== characterId) ? (
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
              gameId={gameId}
              characterId={characterId}
              teamWeeklyScores={teamWeeklyScores}
              teamFinalStats={teamFinalStats}
              team={team}
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
            </Box>
            <Box flex={2} minWidth={0} ml={1} display="flex" flexDirection="column" gap={1}>
              <CustomTable
                gameId={gameId}
                characterId={characterId}
                build={build}
                team={team}
                isLoading={isLoading}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
