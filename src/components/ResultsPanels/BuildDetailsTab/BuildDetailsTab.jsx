import { Stack } from '@mui/material';
import Mainstats from './Mainstats';
import Substats from './Substats';

const BuildDetailsTab = ({ results }) => {
  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Mainstats results={results} />
      <Substats results={results} />
    </Stack>
  );
};

export default BuildDetailsTab;
