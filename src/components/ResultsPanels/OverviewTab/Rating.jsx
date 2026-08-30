import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { formatDays, formatNum, estimateDay } from '@/utils';

const GRADE_BANDS = [
  { floor: 90, letter: 'A', color: '#4ade80' },
  { floor: 80, letter: 'B', color: '#86efac' },
  { floor: 70, letter: 'C', color: '#fbbf24' },
  { floor: 60, letter: 'D', color: '#f97316' },
];

function getGrade(pct) {
  if (pct > 100) return { grade: 'S', color: '#FFD700' };

  for (const { floor, letter, color } of GRADE_BANDS) {
    if (pct >= floor) {
      const pos = pct - floor;
      const suffix = pos >= 7 ? '+' : pos < 3 ? '-' : '';
      return { grade: letter + suffix, color };
    }
  }

  return { grade: 'E', color: '#ef4444' };
}

const Stat = ({ label, value, valueColor }) => {
  return (
    <Card
      component={Stack}
      elevation={6}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        p: 1,
        flex: 1,
      }}
    >
      <Typography variant="overline" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: valueColor }}>
        {value}
      </Typography>
    </Card>
  );
};

const Rating = ({ results }) => {
  const { userDay, userDps, dpsCeiling, fit, dpsProgression, benchmarkDps } = results;

  const benchmarkPct = userDps / benchmarkDps * 100;
  const { grade, color: gradeColor } = getGrade(benchmarkPct);

  const timePercentMore1 = estimateDay(userDps * 1.01, dpsCeiling, dpsProgression, fit);
  const timePercentMore5 = estimateDay(userDps * 1.05, dpsCeiling, dpsProgression, fit);
  const timePercentMore10 = estimateDay(userDps * 1.1, dpsCeiling, dpsProgression, fit);

  const formatEdgeDays = (days) =>
    Math.floor(days) === 0
      ? '<1 day'
      : formatDays(days);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader title="Overall Rating" />
      <CardContent component={Stack} divider={<Divider />} spacing={2} sx={{ flex: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
          <Typography variant="h4" sx={{ color: gradeColor, fontWeight: 'bold' }}>
            {grade}
          </Typography>
          <Typography variant="body1" sx={{ color: gradeColor, opacity: 0.7 }}>
            ({benchmarkPct.toFixed()}%)
          </Typography>
          <Typography variant="caption" color="textSecondary">
            of benchmark
          </Typography>
        </Stack>

        <Stack
          direction="row"
          divider={<Divider orientation="vertical" />}
          spacing={2}
          sx={{ flex: 1 }}
        >
          <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
            <Stat label="Team DPS" value={formatNum(userDps)} />
            <Stat label="Benchmark" value={formatNum(benchmarkDps)} />
            <Stat label="Theoretical Max" value={formatNum(dpsCeiling)} />
          </Stack>

          <Stack spacing={1} sx={{ flex: 1 }}>
            <Typography>
              Estimated farming time
            </Typography>

            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="textSecondary">
                {formatNum(userDps)} dps (current)
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {formatEdgeDays(userDay)}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="textSecondary">
                {formatNum(userDps * 1.01)} dps (+1%)
              </Typography>
              <Typography variant="body2" color="textSecondary">
                + {formatEdgeDays(timePercentMore1 - userDay)}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="textSecondary">
                {formatNum(userDps * 1.05)} dps (+5%)
              </Typography>
              <Typography variant="body2" color="textSecondary">
                + {formatEdgeDays(timePercentMore5 - userDay)}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="textSecondary">
                {formatNum(userDps * 1.1)} dps (+10%)
              </Typography>
              <Typography variant="body2" color="textSecondary">
                + {formatEdgeDays(timePercentMore10 - userDay)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Rating;
