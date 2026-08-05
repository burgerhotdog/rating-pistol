import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Stack,
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
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ComposedChart } from '@/components';
import { useElementColors } from '@/hooks';
import { formatDmg, formatNum, ceil } from '@/utils';

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

const MODES = {
  level: { label: 'DPS', unit: '', axisLabel: 'DPS', showPct: true },
  rate: { label: 'Δ DPS', unit: '/wk', axisLabel: 'Δ DPS / week', showPct: true },
  accel: { label: 'Δ² DPS', unit: '/wk²', axisLabel: 'Δ\u00B2 DPS / week\u00B2', showPct: false },
};

const Progress = ({ trialBands, userDps }) => {
  const { palette } = useTheme();
  const color = useElementColors({ char: '$curr' });
  const [mode, setMode] = useState('level');

  const levels = useMemo(() =>
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

  const data = mode === 'level' ? levels : mode === 'rate' ? rates : accel;
  const dataByWeek = useMemo(() =>
    Object.fromEntries(data.map((d) => [d.week, d])),
    [data],
  );

  // Used only for the "slope as % of total DPS" tooltip stat in rate mode —
  // kept in the same smoothing state as the main series so the comparison
  // is apples-to-apples.
  const levelsByWeek = useMemo(() =>
    Object.fromEntries(levels.map((d) => [d.week, d])),
    [levels],
  );

  const isDerivative = mode !== 'level';

  const yDomain = useMemo(() => {
    if (mode === 'level') return [0, ceil(Math.max(trialBands.at(-1).p90, userDps), -4)];

    const yValues = data.flatMap(({ band80Low, band80High }) => {
      const p10 = band80Low;
      const p90 = band80Low + band80High
      return [p10, p90];
    });

    if (mode === 'rate') return [0, Math.max(0, ...yValues)];

    return [Math.min(0, ...yValues), 0];
  }, [data, mode, trialBands, userDps]);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title="Simulated Farming Progression"
        action={
          <ToggleButtonGroup
            value={mode}
            onChange={(_, next) => next && setMode(next)}
          >
            <ToggleButton value="level">
              <Tooltip title="Show progression (DPS/week)">
                <ShowChartIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="rate">
              <Tooltip title="Show improvement rate (Δ DPS/week)">
                <TrendingUpIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="accel">
              <Tooltip title="Show improvement acceleration (Δ² DPS/week²)">
                <BoltIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent component={Stack} sx={{ flex: 1 }}>
        <ComposedChart data={data}>
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
                      {pctDiff.toFixed(4)}%
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