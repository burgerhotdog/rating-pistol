import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mean, standardDeviation } from 'simple-statistics';
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Bar, BarChart, Scatter, Tooltip, XAxis, YAxis } from 'recharts';
import { WW, SUBSTAT } from '@/data';
import { useAccent } from '@/hooks';
import { formatStr } from '@/utils';
import { Switch } from '../../Colored';

const chanceOfStat = (weights, stat) => {
  const dfs = (pool, remainingDraws, prob) => {
    if (pool.every(([name]) => name !== stat)) return 0;
    if (remainingDraws === 0) return 0;

    const total = pool.reduce((s, [, w]) => s + w, 0);
    let result = 0;

    for (let i = 0; i < pool.length; i++) {
      const [name, weight] = pool[i];
      const p = weight / total;

      if (name === stat) {
        result += prob * p;
      } else {
        const nextPool = pool.slice();
        nextPool.splice(i, 1);
        result += dfs(nextPool, remainingDraws - 1, prob * p);
      }
    }

    return result;
  };

  return dfs(weights, 4, 1);
};

function createIsImportantStat(gameId, userMainstatConfigKey = '', userConfigSubstatRolls = {}) {
  const meanTotalSubstatRolls = Object.values(userConfigSubstatRolls)
    .reduce((acc, rollsArray) => acc + mean(rollsArray), 0);

  const getFrequency = (stat) => mean(userConfigSubstatRolls[stat]) / meanTotalSubstatRolls;

  if (gameId === WW) {
    const unbiasedFrequency = 11899 / 128700;
    return (stat) => getFrequency(stat) > unbiasedFrequency;
  }

  const mainstatIds = userMainstatConfigKey.split('|');

  return (stat) => {
    const baseChances = mainstatIds.map((mainstatId) => {
      const weights = Object.values(SUBSTAT[gameId])
        .filter(({ id }) => id !== mainstatId)
        .map(({ id, weight }) => [id, weight]);
      return chanceOfStat(weights, stat);
    });

    const avgRolls = baseChances
      .map((chance) => chance * 2.05)
      .reduce((acc, chance) => acc + chance, 0);

    const unbiasedFrequency = avgRolls / 41;

    return getFrequency(stat) > unbiasedFrequency;
  };
}

const quantile = (sorted, q) => {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] !== undefined
    ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
    : sorted[base];
};

const getQuantiles = (rolls = []) => {
  if (rolls.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0 };
  }
  const sorted = [...rolls].sort((a, b) => a - b);
  return {
    min: sorted[0],
    q1: quantile(sorted, 0.25),
    median: quantile(sorted, 0.5),
    q3: quantile(sorted, 0.75),
    max: sorted[sorted.length - 1],
  };
};

const gaussianKDE = (values = [], steps = 48) => {
  const n = values.length;
  if (n === 0) return [];

  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);

  if (dataMax === dataMin) {
    return [
      { v: dataMin, density: 0 },
      { v: dataMin, density: 1 },
    ];
  }

  const std = standardDeviation(values) || 0.1;
  const bandwidth = Math.max(1.06 * std * Math.pow(n, -1 / 5), 0.05);

  const points = [];
  for (let i = 0; i <= steps; i++) {
    const v = dataMin + (i / steps) * (dataMax - dataMin);
    let sum = 0;
    for (const x of values) {
      const u = (v - x) / bandwidth;
      sum += Math.exp(-0.5 * u * u);
    }
    points.push({ v, density: sum / (n * bandwidth * Math.sqrt(2 * Math.PI)) });
  }

  const maxDensity = Math.max(...points.map((p) => p.density), 1e-9);
  return points.map((p) => ({ v: p.v, density: p.density / maxDensity }));
};

const AXIS_DOMAIN = [0, 5];
const violinDataKey = () => AXIS_DOMAIN;

const classifyRoll = (user, { min, q1, q3, max }) => {
  if (user >= q1 && user <= q3) return 'ideal';
  if (user >= min && user <= max) return 'acceptable';
  return 'off';
};

const Substats = ({ results }) => {
  const { equipListConfigs, userMainstatConfigKey, userSubstatRolls } = results;
  const { gameId } = useParams();
  const { palette } = useTheme();
  const accent = useAccent();

  const [showAll, setShowAll] = useState(false);
  const userConfig = equipListConfigs[userMainstatConfigKey];
  if (!userConfig) return;

  const isImportantStat = createIsImportantStat(gameId, userMainstatConfigKey, userConfig.substatRolls);

  const data = Object.entries(userConfig.substatRolls)
    .filter(([id]) => showAll || isImportantStat(id))
    .map(([id, rolls]) => {
      const { min, q1, median, q3, max } = getQuantiles(rolls);
      const violin = gaussianKDE(rolls);
      const user = userSubstatRolls[id] ?? 0;
      const label = formatStr(id);
      const zone = classifyRoll(user, { min, q1, q3, max });

      return { stat: label, min, q1, median, q3, max, user, violin, zone };
    })
    .sort((a, b) => b.median - a.median);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title="Substat Distribution"
        action={
          <FormControlLabel
            control={
              <Switch
                color={accent}
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
              />
            }
            label="Show all"
          />
        }
      />
      <CardContent component={Stack} direction="row" sx={{ flex: 1 }}>
        <BarChart
          data={data}
          style={{ width: '100%', height: '100%' }}
          responsive
        >
          <XAxis
            type="category"
            dataKey="stat"
            tick={{ fontSize: 11 }}
            tickFormatter={(label) => label.length > 12 ? `${label.slice(0, 11)}…` : label}
            allowDuplicatedCategory={false}
          />

          <YAxis
            type="number"
            tickCount={6}
            domain={AXIS_DOMAIN}
          />

          <Bar
            dataKey={violinDataKey}
            name="Rolls"
            shape={(props) => {
              const entry = data.find((d) => d.stat === props.stat) ?? props;
              const { x, y, width, height, violin } = { ...props, violin: entry.violin };
              if (!violin) return null;

              const halfWidth = (width / 2) * 0.9;
              const cx = x + width / 2;
              const [domainMin, domainMax] = AXIS_DOMAIN;

              const toPixelY = (v) =>
                y + height * (1 - (v - domainMin) / (domainMax - domainMin));

              const rightSide = violin.map(({ v, density }) => `${cx + density * halfWidth},${toPixelY(v)}`);
              const leftSide = violin
                .slice()
                .reverse()
                .map(({ v, density }) => `${cx - density * halfWidth},${toPixelY(v)}`);
              const pathD = `M ${rightSide.join(' L ')} L ${leftSide.join(' L ')} Z`;

              const q1Y = toPixelY(entry.q1);
              const q3Y = toPixelY(entry.q3);
              const medianY = toPixelY(entry.median);

              return (
                <g>
                  <path
                    d={pathD}
                    fill={alpha(accent, 0.55)}
                    stroke={accent}
                    strokeWidth={1}
                  />
                  <line
                    x1={cx}
                    x2={cx}
                    y1={q1Y}
                    y2={q3Y}
                    stroke={palette.text.primary}
                    strokeWidth={3}
                    strokeOpacity={0.6}
                  />
                  <line
                    x1={cx - halfWidth * 0.25}
                    x2={cx + halfWidth * 0.25}
                    y1={medianY}
                    y2={medianY}
                    stroke={palette.background.paper}
                    strokeWidth={2}
                  />
                </g>
              );
            }}
            fillOpacity={1}
          />

          <Scatter
            data={data}
            dataKey="user"
            name="Your Rolls"
            animationEasing="ease"
            shape={(props) => {
              const { cx, cy, payload } = props;
              const fill =
                payload.zone === 'ideal'
                  ? palette.success.main
                  : payload.zone === 'acceptable'
                    ? palette.warning.main
                    : palette.error.main;

              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={fill}
                  stroke={palette.background.paper}
                  strokeWidth={1}
                />
              );
            }}
          />

          <Tooltip
            content={({ payload, label }) => {
              const violinPayload = payload?.find((p) => p.dataKey === violinDataKey || p.name === 'Rolls');
              const entry = violinPayload?.payload;
              return (
                <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
                  <Typography variant="subtitle2">
                    {label}
                  </Typography>
                  {entry && (
                    <Stack>
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="textSecondary">
                          Range:
                        </Typography>
                        <Typography variant="caption">
                          {Number(entry.min).toFixed(1)} - {Number(entry.max).toFixed(1)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="textSecondary">
                          IQR:
                        </Typography>
                        <Typography variant="caption">
                          {Number(entry.q1).toFixed(1)} - {Number(entry.q3).toFixed(1)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="textSecondary">
                          Your rolls:
                        </Typography>
                        <Typography variant="caption">
                          {Number(entry.user).toFixed(1)}
                        </Typography>
                      </Stack>
                      {entry.zone && (
                        <Typography
                          variant="caption"
                          sx={{ mt: 0.5, fontWeight: 600 }}
                          color={
                            entry.zone === 'ideal'
                              ? 'success.main'
                              : entry.zone === 'acceptable'
                                ? 'warning.main'
                                : 'error.main'
                          }
                        >
                          {entry.zone === 'ideal' && 'Within ideal range'}
                          {entry.zone === 'acceptable' && 'Within acceptable range'}
                          {entry.zone === 'off' && 'Outside typical range'}
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Paper>
              );
            }}
            cursor={{ fill: alpha(palette.text.primary, 0.1) }}
            isAnimationActive={false}
          />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default Substats;
