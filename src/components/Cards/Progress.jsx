import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Area,
  CartesianGrid,
  ReferenceLine,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ComposedChart } from '@/components';
import { useElementColors } from '@/hooks';
import { formatDmg, formatNum } from '@/utils';

const PROJECTED_WEEKS = 5;

function buildData(series) {
  const data = [];
  for (const entry of series) {
    const { p10, p25, p50, p75, p90, ...rest } = entry;
    data.push({
      ...rest,
      median: p50,
      band50Low: p25,
      band50High: p75 - p25,
      band80Low: p10,
      band80High: p90 - p10,
    });
  }
  return data;
}

function estimateEquivalentWeek(userDps, dpsCeiling, fit) {
  if (!fit || !dpsCeiling) return null;
  const remaining = dpsCeiling - userDps;
  if (remaining <= 0) return null;
  return (fit.A / remaining) ** (1 / fit.q);
}

const Progress = ({ dpsProgression, userDps, dpsCeiling, thresholdWeeks, fit }) => {
  const { palette } = useTheme();
  const color = useElementColors({ char: '$curr' });

  const levelsSeries = useMemo(() => dpsProgression.map((entry, index) => ({
    ...entry,
    week: index,
  })), [dpsProgression]);

  const levels = useMemo(() => buildData(levelsSeries), [levelsSeries]);

  const dataSeriesByWeek = Object.fromEntries(levelsSeries.map((entry) => {
    const { week, ...rest } = entry;
    return [week, rest];
  }));

  const estimatedWeek = estimateEquivalentWeek(userDps, dpsCeiling, fit);

  const chartData = useMemo(() => {
    const estWeek = estimatedWeek ?? levels.at(-1).week;
    const lastRealPoint = levels.at(-1);

    const valueAt = (week) => {
      if (week <= lastRealPoint.week) {
        const lo = levels[Math.floor(week)];
        const hi = levels[Math.ceil(week)] ?? lo;
        const t = week - Math.floor(week);
        const lerp = (a, b) => a + (b - a) * t;
        return {
          mean: lerp(lo.mean, hi.mean),
          band50Low: lerp(lo.band50Low, hi.band50Low),
          band50High: lerp(lo.band50High, hi.band50High),
          band80Low: lerp(lo.band80Low, hi.band80Low),
          band80High: lerp(lo.band80High, hi.band80High),
        };
      }
      const mean = dpsCeiling - fit.A * week ** -fit.q;
      const offset = mean - lastRealPoint.mean;
      return {
        mean,
        band50Low: lastRealPoint.band50Low + offset,
        band50High: lastRealPoint.band50High,
        band80Low: lastRealPoint.band80Low + offset,
        band80High: lastRealPoint.band80High,
      };
    };

    const dataPoints = [];
    for (let i = 0; i < estWeek + PROJECTED_WEEKS; i++ ) {
      const { mean, ...bands } = valueAt(i);
      const dataPoint = { week: i };

      if (i > estWeek) {
        dataPoint.extrapolatedMean = mean;
      } else {
        dataPoint.mean = mean;
        Object.assign(dataPoint, bands);
      }

      dataPoints.push(dataPoint);
    }

    if (!Number.isInteger(estWeek)) {
      const boundary = { week: estWeek, ...valueAt(estWeek) };
      boundary.extrapolatedMean = boundary.mean;
      const insertAt = dataPoints.findIndex((p) => p.week > estWeek);
      dataPoints.splice(insertAt === -1 ? dataPoints.length : insertAt, 0, boundary);
    }

    return dataPoints;
  }, [levels, fit, dpsCeiling, estimatedWeek]);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader title="Simulated Trajectory" />
      <CardContent component={Stack} sx={{ flex: 1 }}>
        <ComposedChart data={chartData} margin={{ top: 16 }}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={palette.divider}
          />
          <XAxis
            dataKey="week"
            domain={[0, chartData.at(-1).week]}
            type="number"
            tick={{ fontSize: 12 }}
            tickCount={chartData.length - 1}
            label={{
              value: 'Weeks',
              position: 'insideBottomRight',
              fontSize: 12,
            }}
          />
          <YAxis
            domain={[0, Math.max(levelsSeries.at(-1).p90, dpsCeiling ?? 0, userDps ?? 0)]}
            tick={{ fontSize: 12 }}
            tickFormatter={formatDmg}
            label={{
              value: 'Team DPS',
              angle: -90,
              position: 'insideLeft',
              fontSize: 12,
            }}
          />

          {dpsCeiling != null && (
            <ReferenceLine
              y={dpsCeiling}
              stroke={palette.warning.main}
              strokeDasharray="4 4"
              label={{
                value: 'Theoretical Max',
                position: 'insideBottomRight',
                fontSize: 11,
                fill: palette.warning.main,
              }}
            />
          )}
          {fit && dpsCeiling != null && (
            <ReferenceLine
              x={estimatedWeek ?? levels.at(-1).week}
              stroke={palette.divider}
              label={{
                value: 'projected trend →',
                position: 'insideTop',
                fontSize: 10,
                fill: palette.text.secondary,
              }}
            />
          )}

          <Area
            type="monotone"
            dataKey="mean"
            stroke={color}
            strokeWidth={1.5}
            fill="url(#gradient)"
            activeDot={false}
          />

          {fit && dpsCeiling != null && (
            <Area
              type="monotone"
              dataKey="extrapolatedMean"
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray="5 3"
              fill="none"
              activeDot={false}
            />
          )}

          <ChartTooltip
            content={({ payload }) => {
              const { mean, extrapolatedMean, week = 0 } = payload?.[0]?.payload ?? {};
              const weekEntry = dataSeriesByWeek[week] ?? {};
              const prevEntry = dataSeriesByWeek[Number(week) - 1] ?? {};

              const value = mean ?? extrapolatedMean;
              const prevValue = prevEntry.mean ?? weekEntry.extrapolatedMean;
              const pctDiff = prevValue != null ? (value / prevValue - 1) * 100 : null;
              const diffColor = pctDiff >= 0 ? 'success.main' : 'error.main';
              return (
                <Card elevation={4}>
                  <CardContent component={Stack} spacing={1}>
                    <Typography variant="subtitle2">
                      Week {week}:
                    </Typography>

                    <Divider />

                    <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
                      <Typography variant="body2">
                        Mean:
                      </Typography>

                      <Typography variant="body2">
                        {formatNum(value ?? 0)}
                      </Typography>

                      {pctDiff != null && (
                        <Typography variant="body2" align="right" sx={{ color: diffColor }}>
                          {pctDiff > 0 ? '+' : ''}
                          {pctDiff.toFixed(2)}%
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              );
            }}
          />
        </ComposedChart>
      </CardContent>
    </Card>
  );
};

export default Progress;
