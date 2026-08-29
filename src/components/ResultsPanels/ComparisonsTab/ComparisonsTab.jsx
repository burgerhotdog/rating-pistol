import { Stack } from '@mui/material';
import Weapon from './Weapon';

const ComparisonsTab = ({ results }) => {
  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Weapon results={results} />
    </Stack>
  );
};

export default ComparisonsTab;
