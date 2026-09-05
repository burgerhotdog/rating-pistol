import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { formatNum } from '@/utils';
import RotationTimeline from './RotationTimeline';
import Distribution from './Distribution';

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

const OverviewTab = ({ results }) => {
  const { userDps, dpsCeiling, benchmarkDps } = results;

  const benchmarkPct = userDps / benchmarkDps * 100;
  const { grade, color: gradeColor } = getGrade(benchmarkPct);

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
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
            </Stack>
          </CardContent>
        </Card>

        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader
            title="Damage Distribution"
          />
          <Distribution results={results} />
        </Card>
      </Stack>

      <RotationTimeline results={results} />
    </Stack>
  );
};

export default OverviewTab;
