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

function buildData(dpsProgression, userDay, userDps, upperBound, dpsCeiling, fit) {
  const data = dpsProgression.filter(({ day }) => day <= upperBound).map(({ day, mean }) => {
    if (day < userDay) {
      return { day, mean };
    } else if (day > userDay) {
      return { day, extrapolatedMean: mean };
    } else {
      return { day, mean, extrapolatedMean: mean };
    }
  });

  // fit line
  const fitLineStart = dpsProgression.at(-1).day + 10;
  for (let day = fitLineStart; day <= upperBound; day += 10) {
    const mean = dpsCeiling - fit.A * day ** -fit.q;

    if (day < userDay) {
      data.push({ day, mean });
    } else if (day > userDay) {
      data.push({ day, extrapolatedMean: mean });
    } else {
      data.push({ day, mean, extrapolatedMean: mean });
    }
  }

  // lerp estimatedDay point
  if (!Number.isInteger(userDay)) {
    const hiIndex = data.findIndex(({ day }) => day > userDay);
    if (hiIndex) {
      data.splice(hiIndex, 0, {
        day: userDay,
        mean: userDps,
        extrapolatedMean: userDps,
      });
    } else {
      data.push({
        day: userDay,
        mean: userDps,
        extrapolatedMean: userDps,
      });
    }
  }

  return data;
}

const Progress = ({ results }) => {
  const { dpsProgression, userDay, userDps, dpsCeiling, fit, benchmarkDay } = results;
  
  const { charId } = useParams();
  const { element } = useData('character')[charId];
  const { color } = useData('element')[element];
  const { palette } = useTheme();

  const upperBound = Math.max(userDay, benchmarkDay) * 1.25;

  const chartData = useMemo(
    () => buildData(dpsProgression, userDay, userDps, upperBound, dpsCeiling, fit),
    [dpsProgression, userDay, userDps, upperBound, dpsCeiling, fit]
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
            x={userDay}
            stroke={palette.divider}
            label={{
              value: 'projected trend →',
              position: 'insideTop',
              fontSize: 12,
              fill: palette.text.secondary,
            }}
          />

          <ReferenceLine
            x={benchmarkDay}
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
                      Day {Math.round(day)}:
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
