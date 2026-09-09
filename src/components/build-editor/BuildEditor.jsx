import { useState } from 'react'; 
import { Card, Stack, Tab, Tabs } from '@mui/material';
import Character from './1-character';
import Weapon from './2-weapon';
import Equips from './3-equips';
import Skills from './4-skills';

const BuildEditor = ({ ...props }) => {
  const [tab, setTab] = useState(1);

  return (
    <Stack spacing={2}>
      <Tabs
        component={Card}
        value={tab}
        onChange={(_, value) => setTab(value)}
        centered
      >
        <Tab value={1} label="Character" />
        <Tab value={2} label="Weapon" />
        <Tab value={3} label="Equips" />
        <Tab value={4} label="Skills" />
      </Tabs>

      {tab === 1 && <Character {...props} />}
      {tab === 2 && <Weapon {...props} />}
      {tab === 3 && <Equips {...props} />}
      {tab === 4 && <Skills {...props} />}
    </Stack>
  );
};

export default BuildEditor;
