import {
  FlexRow,
  FlexCol,
  LoadingBar,
  StatsPanel,
  ProgressChart,
  SubstatDistribution,
  DamageBreakdown,
  MainstatDistribution,
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

          <FlexRow spacing={1}>
            <MainstatDistribution
              configMap={configMap}
              userConfigKey={userConfigKey}
            />

            <DamageBreakdown
              userSummary={userSummary}
            />
          </FlexRow>

          <FlexRow>
            <SubstatDistribution
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
