import { useState } from 'react';
import { Box, Grid } from '@mui/material';
import {
  Bar,
  StatsPanel,
  BenchmarkProgress,
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

      {type !== 'done' ? (
        <Bar
          statusMessage={statusMessage}
          week={week}
          diff={diff}
        />
      ) : (
        <Grid container spacing={1}>
          <Grid size={12}>
            <BenchmarkProgress
              team={team}
              weeklySummaries={weeklySummaries}
              weeklyDistribution={weeklyDistribution}
              userSummary={userSummary}
              cache={cache}
            />
          </Grid>

          <Grid size={6}>
            <MainStatConfigs
              configMap={configMap}
              userConfigKey={userConfigKey}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
            />
          </Grid>

          <Grid size={6}>
            <DamageBreakdown
              userSummary={userSummary}
            />
          </Grid>

          <Grid size={12}>
            <SubstatPriority
              configMap={configMap}
              userConfigKey={userConfigKey}
              userSubStats={userSubStats}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
