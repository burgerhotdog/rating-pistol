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
    type,
    statusMessage,
    userSummary,
    cache,
    diff,
    week,
    weeklySummaries,
    configMap,
    userConfigKey,
    userSubStats,
  } = useSimulation(team);

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <FlexRow spacing={1}>
      <StatsPanel
        team={team}
        updateTeam={updateTeam}
      />

      {type !== 'done' ? (
        <LoadingBar
          statusMessage={statusMessage}
          week={week}
          diff={diff}
        />
      ) : (
        <FlexCol spacing={1}>
          <FlexRow>
            <ProgressChart
              team={team}
              weeklySummaries={weeklySummaries}
              userSummary={userSummary}
              cache={cache}
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
            </Tabs>

            <Divider />

            <TabPanel isActive={tabIndex === 0}>
              <DamageBreakdown
                userSummary={userSummary}
                teamIds={team.map((m) => m.id).filter(Boolean)}
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
          </FlexCard>
        </FlexCol>
      )}
    </FlexRow>
  );
};
