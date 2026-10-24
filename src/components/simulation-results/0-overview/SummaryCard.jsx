import {
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Skeleton,
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
  if (!Number.isFinite(pct)) {
    return { grade: '—', color: 'text.secondary' };
  }

  if (pct > 100) {
    return { grade: 'S', color: '#FFD700' };
  }

  const band = GRADE_BANDS.find(({ floor }) => pct >= floor);

  if (!band) {
    return { grade: 'E', color: qualityColors[1] };
  }

  const { floor, letter, quality } = band;
  const position = pct - floor;
  const suffix = position >= 7 ? '+' : position < 3 ? '-' : '';

  return {
    grade: `${letter}${suffix}`,
    color: qualityColors[quality],
  };
}

function isValidDps(value) {
  return typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= 0;
}

const TextBox = ({ label, value }) => {
  return (
    <Card
      component={Stack}
      elevation={6}
      sx={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        p: 1,
      }}
    >
      <Typography variant="overline" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {isValidDps(value) ? formatNum(value) : <Skeleton width={60} />}
      </Typography>
    </Card>
  );
};

const SummaryCard = ({ userDps, benchmarkDps, dpsCeiling }) => {
  const { qualityColors } = useTheme();

  const userReady = isValidDps(userDps);
  const benchmarkReady = isValidDps(benchmarkDps);
  const ceilingReady = isValidDps(dpsCeiling);

  const allReady = userReady && benchmarkReady && ceilingReady;
  const canGrade = allReady && benchmarkDps > 0;

  const benchmarkPct = canGrade
    ? userDps / benchmarkDps * 100
    : null;

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
          {allReady ? grade : <CircularProgress size={28} color="textSecondary" />}
        </Typography>

        <Typography variant="body1" sx={{ color, opacity: 0.7 }}>
          {allReady
            ? canGrade
              ? `(${benchmarkPct.toFixed()}%)`
              : '(N/A)'
            : <Skeleton width={60} />}
        </Typography>

        <Typography variant="caption" color="textSecondary">
          of benchmark
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ flex: 1 }} >
        <TextBox label="Team DPS" value={userDps} />
        <TextBox label="Benchmark" value={benchmarkDps} />
        <TextBox label="Theoretical Max" value={dpsCeiling} />
      </Stack>
    </CardContent>
  );
};

export default SummaryCard;
