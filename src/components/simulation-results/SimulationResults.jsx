import { useState } from 'react';
import { Stack, Tab } from '@mui/material';
import { Tabs } from '@/components/Colored';
import { useAccent, useData, useSimulation } from '@/hooks';
import Overview from './1-overview';
import Equips from './2-equips';
import SkillLevels from './3-skill-levels';

const SimulationResults = ({ team }) => {
  const accent = useAccent();
  const langData = useData('lang');
  const results = useSimulation(team);
  const [tab, setTab] = useState(1);

  if (results.disabled) return;

  const isDone = results.status === 'done';
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
        <Tab value={2} label={`${langData.Equip} Stats`} />
        <Tab value={3} label="Skill Levels" disabled={!isDone} />
      </Tabs>

      {tab === 1 && <Overview results={results} />}
      {tab === 2 && <Equips results={results} />}
      {tab === 3 && isDone && <SkillLevels results={results} />}
    </Stack>
  );
};

export default SimulationResults;
