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
import { formatNum, estimateDay } from '@/utils';

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

function formatDays(days) {
  if (days < 14) {
    return `${days.toFixed()} days`;
  }

  const weeks = days / 7;

  if (days < 30) {
    return `${weeks.toFixed()} weeks`;
  }

  const months = days / 30;

  if (months < 12) {
    return `${months.toFixed()} months`;
  }

  const years = months / 12;

  if (years < 10) {
    return `${years.toFixed(1)} years`; 
  }

  return `${years.toFixed()} years`;
}

function getEfficiencyLabel(q) {
  if (q == null) return null;
  if (q >= 1.5) return { label: 'Fast', color: 'success.main' };
  if (q >= 0.8) return { label: 'Moderate', color: 'warning.main' };
  return { label: 'Slow', color: 'error.main' };
}

const Stat = ({ label, value, valueColor, tooltip }) => {
  const content = (
    <Box>
      <Typography variant="overline" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: valueColor }}>
        {value}
      </Typography>
    </Box>
  );

  return tooltip ? <Tooltip title={tooltip}>{content}</Tooltip> : content;
};

const Rating = ({ results }) => {
  const { userDay, userDps, dpsCeiling, fit, dpsProgression, benchmarkDps } = results;

  const benchmarkPct = userDps / benchmarkDps * 100;
  const { grade, color: gradeColor } = getGrade(benchmarkPct);

  const timePercentMore1 = estimateDay(userDps * 1.01, dpsCeiling, dpsProgression, fit);
  const timePercentMore5 = estimateDay(userDps * 1.05, dpsCeiling, dpsProgression, fit);
  const timePercentMore10 = estimateDay(userDps * 1.1, dpsCeiling, dpsProgression, fit);

  const efficiency = getEfficiencyLabel(fit?.q);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader title="Overall Rating" />

      <CardContent component={Stack} divider={<Divider />} spacing={2}>
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

        <Stack direction="row" divider={<Divider orientation="vertical" />} spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, flex: 1 }}>
            <Stat label="Team DPS" value={formatNum(userDps)} />
            <Stat label="Benchmark" value={formatNum(benchmarkDps)} />
            <Stat label="Theoretical Max" value={formatNum(dpsCeiling)} />
            {efficiency && (
              <Stat
                label="Farming Curve"
                value={efficiency.label}
                valueColor={efficiency.color}
                tooltip={`Diminishing-returns rate (q = ${fit.k.toFixed(2)}). Faster curves front-load most of the value early.`}
              />
            )}
          </Box>

          <Stack spacing={1} sx={{ flex: 1 }}>
            <Typography>
              Estimated farming time
            </Typography>

            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="textSecondary">
                {formatNum(userDps)} dps (current)
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                ~ {formatDays(userDay)}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="textSecondary">
                {formatNum(userDps * 1.01)} dps (+1%)
              </Typography>
              <Typography variant="body2" color="textSecondary">
                + {formatDays(timePercentMore1 - userDay)}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="textSecondary">
                {formatNum(userDps * 1.05)} dps (+5%)
              </Typography>
              <Typography variant="body2" color="textSecondary">
                + {formatDays(timePercentMore5 - userDay)}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="textSecondary">
                {formatNum(userDps * 1.1)} dps (+10%)
              </Typography>
              <Typography variant="body2" color="textSecondary">
                + {formatDays(timePercentMore10 - userDay)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Rating;
