import { useState } from 'react'; 
import { Card, Stack, Tab, Tabs } from '@mui/material';
import CharacterTab from './CharacterTab';
import WeaponTab from './WeaponTab';
import EquipsTab from './EquipsTab';
import SkillsTab from './SkillsTab';

const BuildEditor = ({ ...props }) => {
  const [tab, setTab] = useState('character');

  return (
    <Stack spacing={1}>
      <Tabs
        component={Card}
        value={tab}
        onChange={(_, value) => setTab(value)}
        centered
      >
        <Tab value="character" label="Character" />
        <Tab value="weapon" label="Weapon" />
        <Tab value="equips" label="Equips" />
        <Tab value="skills" label="Skills" />
      </Tabs>
      {tab === 'character' && <CharacterTab {...props} />}
      {tab === 'weapon' && <WeaponTab {...props} />}
      {tab === 'equips' && <EquipsTab {...props} />}
      {tab === 'skills' && <SkillsTab {...props} />}
    </Stack>
  );
};

export default BuildEditor;
