import { useState } from 'react';
import { Stack, Tab } from '@mui/material';
import { Tabs } from '@/components/Colored';
import { useAccent, useSimulation } from '@/hooks';
import LoadingBar from './LoadingBar';
import Overview from './1-overview';
import Comparison from './2-comparison';
import Equips from './3-equips';
import SkillLevels from './4-skill-levels';

const SimulationResults = ({ team }) => {
  const accent = useAccent();
  const results = useSimulation(team);
  const [tab, setTab] = useState(1);

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
        <Tab value={1} label="Overview" />
        <Tab value={2} label="Weapon/Set Bonuses" />
        <Tab value={3} label="Main/Substats" />
        <Tab value={4} label="Skill Levels" />
      </Tabs>

      {tab === 1 && <Overview results={results} />}
      {tab === 2 && <Comparison results={results} />}
      {tab === 3 && <Equips results={results} />}
      {tab === 4 && <SkillLevels results={results} />}
    </Stack>
  );
};

export default SimulationResults;
