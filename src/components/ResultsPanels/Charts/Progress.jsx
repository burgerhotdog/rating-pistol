import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
  ComposedChart,
  CartesianGrid,
  ReferenceLine,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useData } from '@/hooks';
import { formatDmg, formatNum } from '@/utils';

function estimateEquivalentDay(dpsCeiling, userDps, fit) {
  const remaining = dpsCeiling - userDps;
  return (fit.A / remaining) ** (1 / fit.q);
}

function buildData(dpsProgression, estimatedDay, estimatedBenchmarkDay, dpsCeiling, fit) {
  const data = dpsProgression.map(({ day, mean }) => {
    if (day < estimatedDay) {
      return { day, mean };
    } else if (day > estimatedDay) {
      return { day, extrapolatedMean: mean };
    } else {
      return { day, mean, extrapolatedMean: mean };
    }
  });

  // fit line
  const fitLineStart = dpsProgression.at(-1).day + 7;
  const highestSignificantDay = Math.max(estimatedDay, estimatedBenchmarkDay);
  const fitLineEnd = highestSignificantDay * 1.25;
  for (let day = fitLineStart; day <= fitLineEnd; day += 7) {
    const mean = dpsCeiling - fit.A * day ** -fit.q;

    if (day < estimatedDay) {
      data.push({ day, mean });
    } else if (day > estimatedDay) {
      data.push({ day, extrapolatedMean: mean });
    } else {
      data.push({ day, mean, extrapolatedMean: mean });
    }
  }

  // lerp estimatedDay point
  if (!Number.isInteger(estimatedDay)) {
    const hiIndex = data.findIndex(({ day }) => day > estimatedDay);

    const hi = data[hiIndex];
    const lo = data[hiIndex - 1];

    const t = (estimatedDay - lo.day) / (hi.day - lo.day);
    const mean = lo.mean + (hi.extrapolatedMean - lo.mean) * t;

    data.push({ day: estimatedDay, mean, extrapolatedMean: mean });
  }

  return data.sort((a, b) => a.day - b.day);
}

function findInefficientDay(dpsProgression, fit) {
  let today = 0;
  let todayDps = dpsProgression[0].mean;
  while (true) {
    const tomorrow = today + 1;
    if (tomorrow <= dpsProgression.at(-1).day) {
      const tomorrowDataPoint = dpsProgression.find(({ day }) => day === tomorrow);
    }

    today++;
  }
}

const Progress = ({ dpsProgression, userDps, dpsCeiling, fit }) => {
  const { charId } = useParams();
  const { element } = useData('character')[charId];
  const { color } = useData('element')[element];
  const { palette } = useTheme();

  const estimatedDay = estimateEquivalentDay(dpsCeiling, userDps, fit);

  const estimatedBenchmarkDay = findInefficientDay(dpsProgression, fit);

  const chartData = useMemo(
    () => buildData(dpsProgression, estimatedDay, estimatedBenchmarkDay, dpsCeiling, fit),
    [dpsProgression, estimatedDay, estimatedBenchmarkDay, dpsCeiling, fit]
  );

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader title="Simulated Trajectory" />
      <CardContent component={Stack} sx={{ flex: 1 }}>
        <ComposedChart
          data={chartData}
          margin={{ top: 16 }}
          style={{ width: '100%', height: '100%' }}
          responsive
        >
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
            dataKey="day"
            domain={[0, chartData.at(-1).day]}
            type="number"
            tick={{ fontSize: 12 }}
            tickCount={chartData.length - 1}
            label={{
              value: 'Days',
              position: 'insideBottomRight',
              fontSize: 12,
            }}
          />

          <YAxis
            domain={[0, dpsCeiling]}
            tick={{ fontSize: 12 }}
            tickFormatter={formatDmg}
            label={{
              value: 'Team DPS',
              angle: -90,
              position: 'insideLeft',
              fontSize: 12,
            }}
          />

          <ReferenceLine
            y={dpsCeiling}
            stroke={palette.warning.main}
            strokeDasharray="4 4"
            label={{
              value: 'Theoretical Max',
              position: 'insideBottomRight',
              fontSize: 12,
              fill: palette.warning.main,
            }}
          />

          <ReferenceLine
            x={estimatedDay}
            stroke={palette.divider}
            label={{
              value: 'projected trend →',
              position: 'insideTop',
              fontSize: 12,
              fill: palette.text.secondary,
            }}
          />

          <ReferenceLine
            x={estimatedBenchmarkDay}
            label={{
              value: 'Benchmark',
              position: 'insideTop',
              fontSize: 12,
              fill: palette.text.secondary,
            }}
          />

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
              const { mean, extrapolatedMean, day = 0 } = payload?.[0]?.payload ?? {};

              const value = mean ?? extrapolatedMean;
              return (
                <Card elevation={4}>
                  <CardContent component={Stack} spacing={1}>
                    <Typography variant="subtitle2">
                      Day {day}:
                    </Typography>

                    <Divider />

                    <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
                      <Typography variant="body2">
                        Mean:
                      </Typography>

                      <Typography variant="body2">
                        {formatNum(value ?? 0)}
                      </Typography>
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
