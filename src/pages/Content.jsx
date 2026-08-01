import { useState } from 'react';
import { Box, Tabs, Tab, Divider } from '@mui/material';
import {
  FlexRow,
  FlexCol,
  FlexCard,
  LoadingBar,
  StatsPanel,
  ProgressChart,
  DamageBreakdown,
  MainstatDistribution,
  SubstatDistribution,
  Timeline,
} from '@/components';
import { useSimulation, useTeam } from '@/hooks';

const TabPanel = ({ isActive, children }) => (
  isActive && (
    <Box
      sx={{
        display: 'flex',
        minHeight: 0,
        flex: 1,
      }}
    >
      {children}
    </Box>
  )
);

export const Content = () => {
  const { team, updateTeam } = useTeam();

  const {
    status,
    userSummary,
    prydwenSummary,
    cache,
    diff,
    week,
    weeklySummaries,
    configMap,
    userConfigKey,
    userSubStats,
  } = useSimulation(team);

  const isLoading = !userSummary;

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <FlexRow spacing={1}>
      <StatsPanel
        team={team.members}
        updateTeam={updateTeam}
      />

      {isLoading ? (
        <LoadingBar
          status={status}
          week={week}
          diff={diff}
        />
      ) : (
        <FlexCol spacing={1}>
          <FlexRow>
            <ProgressChart
              team={team.members}
              weeklySummaries={weeklySummaries}
              userSummary={userSummary}
              prydwenSummary={prydwenSummary}
              rotationTime={cache.fullRotationTime}
            />
          </FlexRow>

          <FlexCard>
            <Tabs
              value={tabIndex}
              onChange={(_, newIndex) => setTabIndex(newIndex)}
              centered
            >
              <Tab label="Damage Profile" />
              <Tab label="Mainstats" />
              <Tab label="Substats" />
              <Tab label="Timeline" />
            </Tabs>

            <Divider />

            <TabPanel isActive={tabIndex === 0}>
              <DamageBreakdown
                userSummary={userSummary}
                teamIds={team.members.map((m) => m.id).filter(Boolean)}
              />
            </TabPanel>

            <TabPanel isActive={tabIndex === 1}>
              <MainstatDistribution
                configMap={configMap}
                userConfigKey={userConfigKey}
              />
            </TabPanel>

            <TabPanel isActive={tabIndex === 2}>
              <SubstatDistribution
                configMap={configMap}
                userConfigKey={userConfigKey}
                userSubStats={userSubStats}
              />
            </TabPanel>

            <TabPanel isActive={tabIndex === 3}>
              <Timeline
                userSummary={userSummary}
                team={team.members}
              />
            </TabPanel>
          </FlexCard>
        </FlexCol>
      )}
    </FlexRow>
  );
};
