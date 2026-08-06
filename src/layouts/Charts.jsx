import { useState } from 'react';
import { Stack, Tab, Tabs } from '@mui/material';
import {
  LoadingBar,
  RatingCard,
  ProgressCard,
  TimelineCard,
  DistributionCard,
  MainstatsCard,
  SubstatsCard,
} from '@/components';
import { useElementColors, useSimulation } from '@/hooks';
import { formatStr } from '@/utils';

const TabPanels = [
  {
    value: 'overview',
    render: (results) => (
      <Stack spacing={1} sx={{ flex: 1 }}>
        <RatingCard
          userDps={results.userDps}
          benchmarkDps={results.benchmarkDps}
        />
        <ProgressCard
          dpsProgression={results.dpsProgression}
          userDps={results.userDps}
          prydwenDps={results.prydwenDps}
        />
      </Stack>
    ),
  },
  {
    value: 'damageProfile',
    render: (results) => (
      <Stack spacing={1} sx={{ flex: 1 }}>
        <TimelineCard
          userSummary={results.userSummary}
          memberIds={results.memberIds}
        />
        <DistributionCard
          userSummary={results.userSummary}
        />
      </Stack>
    ),
  },
  {
    value: 'buildDetails',
    render: (results) => (
      <Stack spacing={1} sx={{ flex: 1 }}>
        <MainstatsCard
          configMap={results.configMap}
          userConfigKey={results.userConfigKey}
        />
        <SubstatsCard
          configMap={results.configMap}
          userConfigKey={results.userConfigKey}
          userSubStats={results.userSubStats}
        />
      </Stack>
    ),
  },
];

const Charts = ({ team }) => {
  const results = useSimulation(team);
  const [tab, setTab] = useState(TabPanels[0].value);
  const color = useElementColors({ char: '$curr' });
  const handleTabs = (_, value) => setTab(value);

  if (!results.userSummary) return (
    <LoadingBar
      status={results.status}
      week={results.week}
      diff={results.diff}
    />
  );

  const activeTab = TabPanels.find((t) => t.value === tab);

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Tabs
        value={tab}
        onChange={handleTabs}
        textColor="inherit"
        slotProps={{ indicator: { sx: { backgroundColor: color } } }}
        centered
      >
        {TabPanels.map(({ value }) => (
          <Tab
            key={value}
            value={value}
            label={formatStr(value)}
          />
        ))}
      </Tabs>

      {activeTab?.render(results)}
    </Stack>
  );
};

export default Charts;
