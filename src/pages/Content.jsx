import { useState } from 'react';
import { Tabs, Tab, Divider } from '@mui/material';
import {
  FlexRow,
  FlexCol,
  FlexCard,
  LoadingBar,
  StatsPanel,
  ProgressChart,
  DamageBreakdown,
  RatingGrade,
  Timeline,
  StatDist,
} from '@/components';
import { useSimulation, useTeam } from '@/hooks';

const TabPanel = ({ isActive, children }) => (
  isActive && (
    <FlexCol>
      {children}
    </FlexCol>
  )
);

export const Content = () => {
  const { team, updateTeam } = useTeam();

  const {
    status,
    week,
    diff,
    trialBands,
    configMap,
    userSummary,
    userDps,
    benchmarkDps,
    prydwenDps,
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
        <FlexCard spacing={1}>
          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
            centered
          >
            <Tab label="Overview" />
            <Tab label="Damage Profile" />
            <Tab label="Build Details" />
          </Tabs>

          <TabPanel isActive={tabIndex === 0}>
            <ProgressChart
              trialBands={trialBands}
              userDps={userDps}
              prydwenDps={prydwenDps}
            />

            <Divider />

            <RatingGrade
              userDps={userDps}
              benchmarkDps={benchmarkDps}
            />
          </TabPanel>

          <TabPanel isActive={tabIndex === 1}>
            <Timeline
              userSummary={userSummary}
              team={team.members}
            />

            <Divider />

            <DamageBreakdown
              userSummary={userSummary}
              teamIds={team.members.map((m) => m.id).filter(Boolean)}
            />
          </TabPanel>

          <TabPanel isActive={tabIndex === 2}>
            <StatDist
              configMap={configMap}
              userConfigKey={userConfigKey}
              userSubStats={userSubStats}
            />
          </TabPanel>
        </FlexCard>
      )}
    </FlexRow>
  );
};
