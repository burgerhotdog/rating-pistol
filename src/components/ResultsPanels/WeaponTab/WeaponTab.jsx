import { Stack } from '@mui/material';
import { useAccent } from '@/hooks';
import ComparisonChart from './ComparisonChart';

const WeaponTab = ({ results }) => {
  const accent = useAccent();

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <ComparisonChart results={results} />
      <ComparisonChart results={results} />

      <svg width="0" height="0">
        <defs>
          <linearGradient id={`gradientAccent`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity={1} />
            <stop offset="100%" stopColor={accent} stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
    </Stack>
  );
};

export default WeaponTab;
