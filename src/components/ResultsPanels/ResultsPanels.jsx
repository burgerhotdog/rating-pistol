import { useState } from 'react';
import { Stack, Tab, Tabs } from '@mui/material';
import { useAccent, useSimulation } from '@/hooks';
import LoadingBar from './LoadingBar';
import OverviewTab from './OverviewTab';
import DamageProfileTab from './DamageProfileTab';
import BuildDetailsTab from './BuildDetailsTab';
import ComparisonsTab from './ComparisonsTab';

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
        value={tab}
        onChange={(_, value) => setTab(value)}
        textColor="inherit"
        slotProps={{ indicator: { sx: { backgroundColor: accent } } }}
        centered
      >
        <Tab value={0} label="Overview" />
        <Tab value={1} label="Damage Profile" />
        <Tab value={2} label="Build Details" />
        <Tab value={3} label="Comparisons" />
      </Tabs>

      {tab === 0 && <OverviewTab results={results} />}
      {tab === 1 && <DamageProfileTab results={results} />}
      {tab === 2 && <BuildDetailsTab results={results} />}
      {tab === 3 && <ComparisonsTab results={results} />}
    </Stack>
  );
};

export default ResultsPanels;
