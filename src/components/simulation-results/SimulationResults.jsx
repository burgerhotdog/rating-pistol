import { useState } from 'react';
import { Stack, Tab } from '@mui/material';
import { useAccent, useSimulation } from '@/hooks';
import { Tabs } from '@/components/Colored';
import LoadingBar from './LoadingBar';
import OverviewTab from './1-overview';
import ComparisonTab from './2-comparison';
import EquipsTab from './3-equips';
import SkillLevelsTab from './4-skill-levels';

const SimulationResults = ({ team }) => {
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
        <Tab value={1} label="Weapon/Set Bonuses" />
        <Tab value={2} label="Main/Substats" />
        <Tab value={3} label="Skill Levels" />
      </Tabs>

      {tab === 0 && <OverviewTab results={results} />}
      {tab === 1 && <ComparisonTab results={results} />}
      {tab === 2 && <EquipsTab results={results} />}
      {tab === 3 && <SkillLevelsTab results={results} />}
    </Stack>
  );
};

export default SimulationResults;
