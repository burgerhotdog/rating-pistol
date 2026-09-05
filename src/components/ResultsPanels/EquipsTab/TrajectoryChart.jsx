import {
  Card,
  CardContent,
  CardHeader,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Area,
  ComposedChart,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAccent, useData } from '@/hooks';
import { estimateDps, formatDmg, formatNum } from '@/utils';

function buildData(dpsProgression, userDay, userDps, maxDay, dpsCeiling, fit) {
  const data = [];

  for (const { day, mean } of dpsProgression) {
    if (day > maxDay) continue;

    if (day < userDay) {
      data.push({ day, solidMean: mean });
    } else if (day > userDay) {
      data.push({ day, dottedMean: mean });
    } else {
      data.push({ day, solidMean: mean, dottedMean: mean });
    }
  }

  for (let day = dpsProgression.length; day <= maxDay; day++) {
    const mean = dpsCeiling - fit.A * day ** -fit.k;

    if (day < userDay) {
      data.push({ day, solidMean: mean });
    } else if (day > userDay) {
      data.push({ day, dottedMean: mean });
    } else {
      data.push({ day, solidMean: mean, dottedMean: mean });
    }
  }

  if (!Number.isInteger(userDay)) {
    const hiIndex = data.findIndex(({ day }) => day > userDay);

    if (hiIndex) {
      data.splice(hiIndex, 0, { day: userDay, solidMean: userDps, dottedMean: userDps });
    } else {
      data.push({ day: userDay, solidMean: userDps, dottedMean: userDps });
    }
  }

  return data;
}

const TrajectoryChart = ({ results }) => {
  const { dpsProgression, userDay, userDps, dpsCeiling, fit, benchmarkDay } = results;
  const { palette } = useTheme();
  const accent = useAccent();
  const { staminaPerDay } = useData('misc');

  const maxDay = Math.ceil(Math.max(userDay, benchmarkDay, 1) * 1.25);
  const data = buildData(dpsProgression, userDay, userDps, maxDay, dpsCeiling, fit);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader title="Estimated Farming Trajectory" />
      <CardContent component={Stack} sx={{ flex: 1 }}>
        <ComposedChart
          data={data}
          margin={{ top: 16 }}
          style={{ width: '100%', height: '100%' }}
          responsive
        >
          <CartesianGrid strokeDasharray="3 3" stroke={palette.divider} />

          <XAxis
            dataKey="day"
            domain={[0, maxDay]}
            ticks={Array.from({ length: maxDay + 1 }, (_, i) => i)}
            tick={{ fontSize: 12 }}
            type="number"
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
            dataKey="solidMean"
            stroke={accent}
            fill="url(#accentGradient)"
            activeDot={false}
          />

          {fit && dpsCeiling != null && (
            <Area
              type="monotone"
              dataKey="dottedMean"
              stroke={accent}
              strokeDasharray="5 3"
              fill="none"
              activeDot={false}
            />
          )}

          <Tooltip
            content={({ payload }) => {
              if (!payload?.[0]?.payload) return;
              const { solidMean, dottedMean, day = 0 } = payload[0].payload;
              const value = solidMean ?? dottedMean;

              const nextDayDps = estimateDps(day + 1, dpsCeiling, dpsProgression, fit);
              const nextDiff = (nextDayDps / value * 100) - 100;
              const diffPerStamina = nextDiff / staminaPerDay;

              return (
                <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
                  <Stack>
                    <Typography variant="caption">
                      Day {Math.round(day)}
                    </Typography>
                    <Typography variant="caption">
                      DPS: {formatNum(value ?? 0)}
                    </Typography>
                    <Typography variant="caption">
                      Rate: {Math.abs(diffPerStamina).toFixed(4)}% per stamina
                    </Typography>
                  </Stack>
                </Paper>
              );
            }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </CardContent>
    </Card>
  );
};

export default TrajectoryChart;
