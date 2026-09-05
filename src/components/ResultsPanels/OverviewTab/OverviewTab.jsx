import { Stack } from '@mui/material';
import Rating from './Rating';
import RotationTimeline from './RotationTimeline';
import Distribution from './Distribution';

const OverviewTab = ({ results }) => {
  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Rating results={results} />
        <Distribution results={results} />
      </Stack>

      <RotationTimeline results={results} />
    </Stack>
  );
};

export default OverviewTab;
