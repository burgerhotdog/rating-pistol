import { useState } from 'react';
import { Stack, Tab, CircularProgress } from '@mui/material';
import {
  Info,
  Timeline,
  Science,
} from '@mui/icons-material';
import { Tabs } from '@/components/Colored';
import { useAccent, useData, useSimulation } from '@/hooks';
import Overview from './0-overview';
import Equips from './1-equips';
import Lab from './3-lab';

const SimulationResults = ({ team }) => {
  const accent = useAccent();
  const langData = useData('lang');
  const results = useSimulation(team);
  const [tab, setTab] = useState(0);

  if (results.disabled) return;

  const labReady =
    results.userMember &&
    results.userDps &&
    results.weaponResults &&
    results.setResults;

  if (tab === 2 && !labReady) {
    setTab(0);
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
        <Tab
          value={0}
          icon={<Info />}
          iconPosition="start"
          label="Overview"
        />

        <Tab
          value={1}
          icon={<Timeline />}
          iconPosition="start"
          label={`${langData.Equip} Stats`}
        />

        <Tab
          value={2}
          icon={
            labReady
              ? <Science />
              : <CircularProgress size={20} color="inherit" />
          }
          iconPosition="start"
          label="Lab"
          disabled={!labReady}
        />
      </Tabs>

      {tab === 0 && <Overview results={results} />}
      {tab === 1 && <Equips results={results} />}
      {tab === 2 && <Lab results={results} />}
    </Stack>
  );
};

export default SimulationResults;
