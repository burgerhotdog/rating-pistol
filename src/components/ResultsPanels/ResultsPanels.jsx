import { useState } from 'react';
import { Stack, Tab } from '@mui/material';
import { useAccent, useSimulation } from '@/hooks';
import { Tabs } from '../Colored';
import LoadingBar from './LoadingBar';
import OverviewTab from './OverviewTab';
import DamageProfileTab from './DamageProfileTab';
import BuildAnalysisTab from './BuildAnalysisTab';

const ResultsPanels = ({ team }) => {
  const accent = useAccent();
  const results = useSimulation(team);
  const [tab, setTab] = useState(0);

  if (results.errorLog) {
    console.log(results.errorLog);
    return;
  }

  if (!results.userSnapshots) {
    return <LoadingBar results={results} />;
  }

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Tabs
        color={accent}
        value={tab}
        onChange={(_, value) => setTab(value)}
        textColor="inherit"
        centered
      >
        <Tab value={0} label="Overview" />
        <Tab value={1} label="Build Analysis" />
        <Tab value={2} label="Damage Stats" />
      </Tabs>

      {tab === 0 && <OverviewTab results={results} />}
      {tab === 1 && <BuildAnalysisTab results={results} />}
      {tab === 2 && <DamageProfileTab results={results} />}
    </Stack>
  );
};

export default ResultsPanels;
