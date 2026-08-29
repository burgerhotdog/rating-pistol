import { Stack } from '@mui/material';
import Timeline from './Timeline';
import Distribution from './Distribution';

const DamageProfileTab = ({ results }) => {
  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Timeline results={results} />
      <Distribution results={results} />
    </Stack>
  );
};

export default DamageProfileTab;
