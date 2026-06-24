import { useState } from 'react';
import {
  FlexRow,
  FlexCol,
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
    weeklySummaries,
    configMap,
    userConfigKey,
    userSubStats,
  } = useSimulation(team);
  const [selectedKey, setSelectedKey] = useState(userConfigKey);

  return (
    <FlexRow spacing={1}>
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
        <FlexCol spacing={1}>
          <FlexRow>
            <BenchmarkProgress
              team={team}
              weeklySummaries={weeklySummaries}
              userSummary={userSummary}
              cache={cache}
            />
          </FlexRow>

          <FlexRow spacing={1}>
            <MainStatConfigs
              configMap={configMap}
              userConfigKey={userConfigKey}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
            />

            <DamageBreakdown
              userSummary={userSummary}
            />
          </FlexRow>

          <FlexRow>
            <SubstatPriority
              configMap={configMap}
              userConfigKey={userConfigKey}
              userSubStats={userSubStats}
            />
          </FlexRow>
        </FlexCol>
      )}
    </FlexRow>
  );
};
