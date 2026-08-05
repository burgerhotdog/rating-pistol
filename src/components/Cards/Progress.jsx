import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BoltIcon from '@mui/icons-material/Bolt';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useElementColors } from '@/hooks';
import { formatDmg, formatNum } from '@/utils';

const BAND_KEYS = ['mean', 'median', 'band50Low', 'band50High', 'band80Low', 'band80High'];

// Diffs consecutive entries of a level/rate series across the band keys,
// producing the derivative series (one entry shorter than the input).
const diffSeries = (series) =>
  series.slice(1).map((curr, i) => {
    const prev = series[i]; // series[i] is the entry *before* curr, since curr = series[i+1]

    const p25Diff = curr.band50Low - prev.band50Low;
    const p75Diff =
      curr.band50Low + curr.band50High - (prev.band50Low + prev.band50High);
    const p10Diff = curr.band80Low - prev.band80Low;
    const p90Diff =
      curr.band80Low + curr.band80High - (prev.band80Low + prev.band80High);

    return {
      week: curr.week,
      mean: curr.mean - prev.mean,
      median: curr.median - prev.median,
      band50Low: p25Diff,
      band50High: p75Diff - p25Diff,
      band80Low: p10Diff,
      band80High: p90Diff - p10Diff,
    };
  });

// Centered moving average with a radius-2 window (5 points wide). Near the
// edges the window just shrinks to whatever points are available, rather
// than requiring a full 5 or padding with fake data.
const smoothSeries = (series, radius = 2) =>
  series.map((point, i) => {
    const windowSlice = series.slice(
      Math.max(0, i - radius),
      Math.min(series.length, i + radius + 1),
    );

    const smoothed = { week: point.week };
    for (const key of BAND_KEYS) {
      smoothed[key] =
        windowSlice.reduce((sum, p) => sum + p[key], 0) / windowSlice.length;
    }
    return smoothed;
  });

const MODES = {
  level: { label: 'DPS', unit: '', axisLabel: 'DPS', showPct: true },
  rate: { label: 'Δ DPS', unit: '/wk', axisLabel: 'Δ DPS / week', showPct: true },
  accel: { label: 'Δ² DPS', unit: '/wk²', axisLabel: 'Δ\u00B2 DPS / week\u00B2', showPct: false },
};

const Progress = ({ trialBands, userDps }) => {
  const { palette } = useTheme();
  const color = useElementColors({ char: '$curr' });
  const [mode, setMode] = useState('level');
  const [smoothed, setSmoothed] = useState(false);

  const levels = useMemo(
    () =>
      trialBands.map(({ mean, p10, p25, p50, p75, p90 }, index) => ({
        week: index,
        mean,
        median: p50,
        band50Low: p25,
        band50High: p75 - p25,
        band80Low: p10,
        band80High: p90 - p10,
      })),
    [trialBands],
  );

  const rates = useMemo(() => diffSeries(levels), [levels]);
  const accel = useMemo(() => diffSeries(rates), [rates]);

  const rawData = mode === 'level' ? levels : mode === 'rate' ? rates : accel;
  const data = useMemo(
    () => (smoothed ? smoothSeries(rawData) : rawData),
    [rawData, smoothed],
  );
  const dataByWeek = useMemo(
    () => Object.fromEntries(data.map((d) => [d.week, d])),
    [data],
  );

  // Used only for the "slope as % of total DPS" tooltip stat in rate mode —
  // kept in the same smoothing state as the main series so the comparison
  // is apples-to-apples.
  const smoothedLevels = useMemo(
    () => (smoothed ? smoothSeries(levels) : levels),
    [levels, smoothed],
  );
  const levelsByWeek = useMemo(
    () => Object.fromEntries(smoothedLevels.map((d) => [d.week, d])),
    [smoothedLevels],
  );

  const isDerivative = mode !== 'level';

  const yDomain = useMemo(() => {
    if (!isDerivative) {
      return [0, Math.max(trialBands.at(-1).p90, userDps) * 1.05];
    }
    const values = data.flatMap((d) => [
      d.band80Low,
      d.band80Low + d.band80High,
    ]);
    const min = Math.min(0, ...values);
    const max = Math.max(0, ...values);
    const pad = (max - min) * 0.1 || 1;
    return [min - pad, max + pad];
  }, [data, isDerivative, trialBands, userDps]);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title="Simulated Farming Progression"
        action={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mr: 1 }}>
            <FormControlLabel
              labelPlacement="start"
              sx={{ mr: 0.5 }}
              control={
                <Switch
                  size="small"
                  checked={smoothed}
                  onChange={(e) => setSmoothed(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" sx={{ userSelect: 'none' }}>
                  Smooth
                </Typography>
              }
            />

            <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

            <ToggleButtonGroup
              size="small"
              exclusive
              value={mode}
              onChange={(_, next) => next && setMode(next)}
            >
              <ToggleButton value="level">
                <Tooltip title="Show DPS over time">
                  <ShowChartIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="rate">
                <Tooltip title="Show rate of change (Δ DPS/week)">
                  <TrendingUpIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="accel">
                <Tooltip title="Show rate of the rate of change (Δ² DPS/week²)">
                  <BoltIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        }
      />
      <CardContent component={Stack} sx={{ flex: 1 }}>
        <ComposedChart
          data={data}
          width="100%"
          height="100%"
          responsive
        >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.6} />
              <stop offset="100%" stopColor={color} stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={palette.divider}
          />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 12 }}
            label={{
              value: 'Weeks',
              position: 'insideBottomRight',
              offset: -5,
              fontSize: 12,
            }}
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 12 }}
            tickFormatter={(v) =>
              isDerivative ? `${v >= 0 ? '+' : ''}${formatDmg(v)}` : formatDmg(v)
            }
            label={{
              value: MODES[mode].axisLabel,
              angle: -90,
              position: 'insideLeft',
              fontSize: 12,
            }}
            width="auto"
          />

          <Area
            type="monotone"
            dataKey="band80Low"
            stackId="band80"
            stroke="none"
            fill="transparent"
            activeDot={false}
          />
          <Area
            type="monotone"
            dataKey="band80High"
            stackId="band80"
            stroke="none"
            fill={color}
            fillOpacity={0.15}
            activeDot={false}
          />

          <Area
            type="monotone"
            dataKey="band50Low"
            stackId="band50"
            stroke="none"
            fill="transparent"
            activeDot={false}
          />
          <Area
            type="monotone"
            dataKey="band50High"
            stackId="band50"
            stroke="none"
            fill={color}
            fillOpacity={0.3}
            activeDot={false}
          />

          <Area
            type="monotone"
            dataKey="mean"
            stroke={color}
            strokeWidth={1.5}
            fill="url(#gradient)"
            activeDot={false}
          />

          <ChartTooltip
            content={({ payload }) => {
              const point = payload?.[0]?.payload;
              const { week, mean } = point ?? {};

              const showPct = MODES[mode].showPct;

              let pctDiff = null;
              if (showPct) {
                if (mode === 'level') {
                  // % change vs. the previous week's total.
                  const prevPoint = dataByWeek[week - 1];
                  if (prevPoint && prevPoint.mean !== 0) {
                    pctDiff = ((mean - prevPoint.mean) / Math.abs(prevPoint.mean)) * 100;
                  }
                } else if (mode === 'rate') {
                  // Slope as a % of that week's total DPS, not vs. the
                  // previous slope.
                  const level = levelsByWeek[week];
                  if (level && level.mean !== 0) {
                    pctDiff = (mean / Math.abs(level.mean)) * 100;
                  }
                }
              }

              const diffColor = pctDiff >= 0 ? 'success.main' : 'error.main';

              return (
                <Paper
                  elevation={4}
                  sx={{
                    p: 1.5,
                    minWidth: 160,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Week {week}
                  </Typography>

                  <Divider sx={{ my: 0.5 }} />

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2">
                      {MODES[mode].label}:
                    </Typography>

                    <Typography variant="body2">
                      {isDerivative && mean >= 0 ? '+' : ''}
                      {formatNum(mean ?? 0)}
                      {MODES[mode].unit}
                    </Typography>
                  </Box>

                  {pctDiff != null && (
                    <Typography variant="body2" sx={{ color: diffColor }}>
                      {pctDiff >= 0 ? '+' : ''}
                      {pctDiff.toFixed(1)}%
                      {mode === 'rate' ? ' of total DPS' : ''}
                    </Typography>
                  )}
                </Paper>
              );
            }}
          />
        </ComposedChart>
      </CardContent>
    </Card>
  );
};

export default Progress;