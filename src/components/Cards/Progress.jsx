import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
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
import { formatDmg, formatNum } from '@/utils';

const MODES = {
  level: { label: 'DPS', unit: '', axisLabel: 'DPS', showPct: true },
  rate: { label: 'Δ DPS', unit: '/wk', axisLabel: 'Δ DPS / week', showPct: true },
  accel: { label: 'Δ² DPS', unit: '/wk²', axisLabel: 'Δ\u00B2 DPS / week\u00B2', showPct: false },
};

function diffSeries(series) {
  const diffSeries = [];
  for (const [i, { week, ...rest }] of series.entries()) {
    const prev = series[i - 1];
    if (prev) {
      const entry = { week: (prev.week + week) / 2 };
      for (const key in rest) {
        entry[key] = rest[key] - prev[key];
      }
      diffSeries.push(entry);
    }
  }
  return diffSeries;
}

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

const Progress = ({ dpsProgression }) => {
  const { palette } = useTheme();
  const color = useElementColors({ char: '$curr' });
  const [mode, setMode] = useState('level');

  const levelsSeries = useMemo(() => dpsProgression.map((entry, index) => ({
    ...entry,
    week: index,
  })), [dpsProgression]);
  const ratesSeries = useMemo(() => diffSeries(levelsSeries), [levelsSeries]);
  const accelSeries = useMemo(() => diffSeries(ratesSeries), [ratesSeries]);

  const levels = useMemo(() => buildData(levelsSeries), [levelsSeries]);
  const rates = useMemo(() => buildData(ratesSeries), [ratesSeries]);
  const accel = useMemo(() => buildData(accelSeries), [accelSeries]);

  const data = mode === 'level' ? levels : mode === 'rate' ? rates : accel;
  const dataSeries = mode === 'level' ? levelsSeries : mode === 'rate' ? ratesSeries : accelSeries;
  const dataSeriesByWeek = Object.fromEntries(dataSeries.map((entry) => {
    const { week, ...rest } = entry;
    return [week, rest];
  }));

  const yDomain = useMemo(() => {
    if (mode === 'level') return [0, levelsSeries.at(-1).p90];
    if (mode === 'rate') return [0, ratesSeries.at(0).p90];
    return [accelSeries.at(0).p90, 0];
  }, [mode, levelsSeries, ratesSeries, accelSeries]);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title="Simulated Farming Progression"
        action={
          <Stack>
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
          </Stack>
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
            domain={[0, dpsProgression.length - 1]}
            type="number"
            tick={{ fontSize: 12 }}
            tickCount={dpsProgression.length}
            label={{
              value: 'Weeks',
              position: 'insideBottomRight',
              fontSize: 12,
            }}
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => mode !== 'level' ? `${v >= 0 ? '+' : ''}${formatDmg(v)}` : formatDmg(v)}
            label={{
              value: MODES[mode].axisLabel,
              angle: -90,
              position: 'insideLeft',
              fontSize: 12,
            }}
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
              const { week = 0 } = payload?.[0]?.payload ?? {};
              const weekEntry = dataSeriesByWeek[week] ?? {};
              const prevWeek = Number(week) - 1;
              const prevEntry = dataSeriesByWeek[prevWeek] ?? {};

              return (
                <Card elevation={4}>
                  <CardContent component={Stack} spacing={1}>
                    <Typography variant="subtitle2">
                      Week {week}:
                    </Typography>

                    <Divider />

                    <Stack>
                      {['p90', 'p75', 'p50', 'p25', 'p10', '', 'mean'].map((percentile) => {
                        const value = weekEntry[percentile];
                        const prevValue = prevEntry[percentile];
                        const pctDiff = prevValue != null ? (value / prevValue - 1) * 100 : null;
                        const diffColor = pctDiff >= 0 ? 'success.main' : 'error.main';
                        return (
                          <Stack key={percentile} direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
                            <Typography variant="body2">
                              {percentile}:
                            </Typography>

                            <Typography variant="body2">
                              {mode !== 'level' && value > 0 ? '+' : ''}
                              {formatNum(value ?? 0)}
                              {MODES[mode].unit}
                            </Typography>

                            {pctDiff != null && (
                              <Typography variant="body2" align="right" sx={{ color: diffColor }}>
                                {pctDiff > 0 ? '+' : ''}
                                {pctDiff.toFixed(2)}%
                              </Typography>
                            )}
                          </Stack>
                        );
                      })}
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
