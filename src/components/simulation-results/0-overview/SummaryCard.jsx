import {
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { formatNum } from '@/utils';

const GRADE_BANDS = [
  { floor: 90, letter: 'A', quality: 4 },
  { floor: 80, letter: 'B', quality: 3 },
  { floor: 70, letter: 'C', quality: 2 },
  { floor: 60, letter: 'D', quality: 1 },
];

function getGradeAndColor(pct, qualityColors) {
  if (pct > 100) {
    return { grade: 'S', color: '#FFD700' };
  }

  for (const { floor, letter, quality } of GRADE_BANDS) {
    if (pct >= floor) {
      const pos = pct - floor;
      const suffix = pos >= 7 ? '+' : pos < 3 ? '-' : '';
      const color = qualityColors[quality];
      return { grade: letter + suffix, color };
    }
  }

  return { grade: 'E', color: qualityColors[1] };
}

const TextBox = ({ label, value }) => {
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
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </Card>
  );
};

const SummaryCard = ({ userDps, dpsCeiling, benchmarkDps }) => {
  const { qualityColors } = useTheme();
  const benchmarkPct = userDps / benchmarkDps * 100;
  const { grade, color } = getGradeAndColor(benchmarkPct, qualityColors);

  return (
    <CardContent
      component={Stack}
      divider={<Divider />}
      spacing={2}
      sx={{ flex: 1 }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
        <Typography variant="h4" sx={{ color, fontWeight: 'bold' }}>
          {grade}
        </Typography>
        <Typography variant="body1" sx={{ color, opacity: 0.7 }}>
          ({benchmarkPct.toFixed()}%)
        </Typography>
        <Typography variant="caption" color="textSecondary">
          of benchmark
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        sx={{ flex: 1 }}
      >
        <TextBox label="Team DPS" value={formatNum(userDps)} />
        <TextBox label="Benchmark" value={formatNum(benchmarkDps)} />
        <TextBox label="Theoretical Max" value={formatNum(dpsCeiling)} />
      </Stack>
    </CardContent>
  );
};

export default SummaryCard;
