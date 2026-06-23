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
  const { team, updateTeam } = useTeam();

  const {
    type,
    statusMessage,
    userSummary,
    actionMapsWithSub,
    cache,
    diff,
    week,
    finalStatMap,
    weeklyDistribution,
    weeklySummaries,
  } = useSimulation(team);

  const isLoading = type !== 'done';

  return (
    <Box
      sx={{
        display: 'flex',
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

      {isLoading ? (
        <Bar
          statusMessage={statusMessage}
          week={week}
          diff={diff}
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 250 }}>
            <BenchmarkProgress
              isLoading={isLoading}
              team={team}
              weeklySummaries={weeklySummaries}
              weeklyDistribution={weeklyDistribution}
              userSummary={userSummary}
              cache={cache}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 100, gap: 1 }}>
            <CustomRadarChart
              isLoading={isLoading}
              combinedSimEquips={finalStatMap}
            />

            <DamageBreakdown
              userSummary={userSummary}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 100 }}>
            <SubstatPriority
              isLoading={isLoading}
              userSummary={userSummary}
              actionMapsWithSub={actionMapsWithSub}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
