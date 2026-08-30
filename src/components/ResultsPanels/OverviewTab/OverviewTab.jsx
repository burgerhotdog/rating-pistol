import { Stack } from '@mui/material';
import Progress from './Progress';
import Rating from './Rating';

const OverviewTab = ({ results }) => {
  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Rating results={results} />
      <Progress results={results} />
    </Stack>
  );
};

export default OverviewTab;
