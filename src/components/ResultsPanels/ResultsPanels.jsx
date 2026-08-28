import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Tab, Tabs } from '@mui/material';
import { useData, useSimulation } from '@/hooks';
import { formatStr } from '@/utils';
import {
  RatingCard,
  ProgressCard,
  TimelineCard,
  DistributionCard,
  MainstatsCard,
  SubstatsCard,
  WeaponCard,
} from './Charts';
import LoadingBar from './LoadingBar';

const TabPanels = [
  {
    value: 'overview',
    render: (results) => (
      <Stack spacing={1} sx={{ flex: 1 }}>
        <RatingCard results={results} />
        <ProgressCard results={results} />
      </Stack>
    ),
  },
  {
    value: 'damageProfile',
    render: (results) => (
      <Stack spacing={1} sx={{ flex: 1 }}>
        <TimelineCard results={results} />
        <DistributionCard results={results} />
      </Stack>
    ),
  },
  {
    value: 'buildDetails',
    render: (results) => (
      <Stack spacing={1} sx={{ flex: 1 }}>
        <MainstatsCard results={results} />
        <SubstatsCard results={results} />
      </Stack>
    ),
  },
  {
    value: 'comparisons',
    render: (results) => (
      <Stack spacing={1} sx={{ flex: 1 }}>
        <WeaponCard results={results} />
      </Stack>
    ),
  },
];

const ResultsPanels = ({ team }) => {
  const { charId } = useParams();
  const { element } = useData('character')[charId];
  const { color } = useData('element')[element];

  const [tab, setTab] = useState(TabPanels[0].value);
  const results = useSimulation(team);

  if (results.errorLog) console.log(results.errorLog);

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
        onChange={(_, value) => setTab(value)}
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

export default ResultsPanels;
