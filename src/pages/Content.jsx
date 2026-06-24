import { useState } from 'react';
import { Box } from '@mui/material';
import {
  Bar,
  StatsPanel,
  BenchmarkProgress,
  CustomRadarChart,
  SubstatPriority,
  DamageBreakdown,
  MainStatConfigs,
} from '@/components';
import { useSimulation, useTeam } from '@/hooks';

export const Content = () => {
  const { team, updateTeam } = useTeam();

  const {
    type,
    statusMessage,
    userSummary,
    cache,
    diff,
    week,
    finalStatMap,
    weeklyDistribution,
    weeklySummaries,
    configMap,
    userConfigKey,
    userSubStats,
  } = useSimulation(team);
  const [selectedKey, setSelectedKey] = useState(userConfigKey);

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
            <MainStatConfigs
              configMap={configMap}
              userConfigKey={userConfigKey}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
            />

            <DamageBreakdown
              userSummary={userSummary}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 100 }}>
            <SubstatPriority
              configMap={configMap}
              userConfigKey={userConfigKey}
              userSubStats={userSubStats}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
