import { Stack } from '@mui/material';
import RotationTimeline from './RotationTimeline';
import Distribution from './Distribution';

const DamageProfileTab = ({ results }) => {
  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <RotationTimeline results={results} />
      <Distribution results={results} />
    </Stack>
  );
};

export default DamageProfileTab;
