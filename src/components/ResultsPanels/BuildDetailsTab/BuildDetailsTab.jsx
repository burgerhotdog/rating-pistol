import { Stack } from '@mui/material';
import Weapon from './Weapon';
import Set from './Set';
import Mainstats from './Mainstats';
import Substats from './Substats';

const BuildDetailsTab = ({ results }) => {
  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Weapon results={results} />
        <Set results={results} />
      </Stack>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Mainstats results={results} />
        <Substats results={results} />
      </Stack>
    </Stack>
  );
};

export default BuildDetailsTab;
