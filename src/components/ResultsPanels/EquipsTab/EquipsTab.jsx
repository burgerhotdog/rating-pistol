import { Stack } from '@mui/material';
import { useAccent } from '@/hooks';
import Set from './Set';
import Mainstats from './Mainstats';
import Substats from './Substats';
import TrajectoryChart from './TrajectoryChart';

const EquipsTab = ({ results }) => {
  const accent = useAccent();
  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Set results={results} />
        <Mainstats results={results} />
        <Substats results={results} />
      </Stack>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <TrajectoryChart results={results} />
      </Stack>

      <svg width="0" height="0">
        <defs>
          <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity={0.9} />
            <stop offset="100%" stopColor={accent} stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
    </Stack>
  );
};

export default EquipsTab;
