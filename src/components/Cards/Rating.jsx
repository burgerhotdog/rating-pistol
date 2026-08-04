import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { formatNum } from '@/utils';

const getGrade = (pct) => {
  if (pct > 100) return { grade: 'S', color: '#FFD700' };

  const bands = [
    { floor: 90, letter: 'A', color: '#4ade80' },
    { floor: 80, letter: 'B', color: '#86efac' },
    { floor: 70, letter: 'C', color: '#fbbf24' },
    { floor: 60, letter: 'D', color: '#f97316' },
  ];

  for (const { floor, letter, color } of bands) {
    if (pct >= floor) {
      const pos = pct - floor;
      const suffix = pos >= 7 ? '+' : pos < 3 ? '-' : '';
      return { grade: letter + suffix, color };
    }
  }

  return { grade: 'E', color: '#ef4444' };
};

const Rating = ({ userDps, benchmarkDps }) => {
  const scaledBuildRating = userDps / benchmarkDps * 100;

  const { grade, color: gradeColor } = getGrade(scaledBuildRating);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader title="Overall Rating" />

      <CardContent component={Stack} spacing={1}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h4" sx={{ color: gradeColor, fontWeight: 'bold' }}>
            {grade}
          </Typography>
          <Typography variant="body1" sx={{ color: gradeColor, opacity: 0.7 }}>
            ({scaledBuildRating.toFixed()}%)
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }} >
            <Typography variant="overline" color="textSecondary">
              Team DPS
            </Typography>
            <Tooltip>
              <HelpOutlineOutlinedIcon color="disabled" />
            </Tooltip>
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {formatNum(userDps)}
          </Typography>
        </Box>

        <Box>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }} >
            <Typography variant="overline" color="textSecondary">
              Benchmark
            </Typography>
            <Tooltip>
              <HelpOutlineOutlinedIcon color="disabled" />
            </Tooltip>
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {formatNum(benchmarkDps)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Rating;
