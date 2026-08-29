import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Bar,
  BarChart,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { WW, SUBSTAT } from '@/data';
import { useAccent } from '@/hooks';
import { formatStr } from '@/utils';
import { mean, standardDeviation } from 'simple-statistics';

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

function createSubFilter(gameId, configKey = '', subDist = {}) {
  const totalSubRolls = Object.values(subDist)
    .reduce((acc, rollsList) => acc + mean(rollsList), 0);

  function getFrequency(stat) {
    return (mean(subDist[stat]) ?? 0) / totalSubRolls;
  }

  if (gameId === WW) {
    const unbiasedFrequency = 11899 / 128700;
    return (stat) => getFrequency(stat) > unbiasedFrequency;
  }

  const mainstatsList = configKey.split('|');

  return (stat) => {
    const baseChances = mainstatsList.map((mainstat) => {
      const weights = Object.values(SUBSTAT[gameId])
        .filter(({ id }) => id !== mainstat)
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

// Now computes both the 50% (Q1/Q3) and 80% (P10/P90) bands, alongside
// min/max/median. p10/p90 define the wider "acceptable" zone; q1/q3
// define the tighter "ideal" zone nested inside it.
const getQuantiles = (rolls = []) => {
  if (rolls.length === 0) {
    return { min: 0, p10: 0, q1: 0, median: 0, q3: 0, p90: 0, max: 0 };
  }
  const sorted = [...rolls].sort((a, b) => a - b);
  return {
    min: sorted[0],
    p10: quantile(sorted, 0.1),
    q1: quantile(sorted, 0.25),
    median: quantile(sorted, 0.5),
    q3: quantile(sorted, 0.75),
    p90: quantile(sorted, 0.9),
    max: sorted[sorted.length - 1],
  };
};

// Gaussian KDE, sampled only within the observed data range [min, max] —
// no padding, no synthetic taper.
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

// Classify a roll into one of three zones: ideal (inside 50%), acceptable
// (inside 80% but outside 50%), or off-target (outside 80%) — either
// direction counts the same, since over-investing is as off-target as under.
const classifyRoll = (user, { min, q1, q3, max }) => {
  if (user >= q1 && user <= q3) return 'ideal';
  if (user >= min && user <= max) return 'acceptable';
  return 'off';
};

const Substats = ({ results }) => {
  const { configMap, userConfigKey, userSubStats } = results;
  const { gameId } = useParams();
  const { palette } = useTheme();
  const accent = useAccent();

  const [showAll, setShowAll] = useState(false);

  const { subDist = {} } = configMap[userConfigKey] ?? {};
  const subFilter = createSubFilter(gameId, userConfigKey, subDist);

  const data = Object.keys(SUBSTAT[gameId])
    .filter((stat) => showAll || subFilter(stat))
    .map((stat) => {
      const rolls = subDist[stat] ?? [];
      const { min, p10, q1, median, q3, p90, max } = getQuantiles(rolls);
      const violin = gaussianKDE(rolls);
      const user = userSubStats[stat] ?? 0;
      const label = formatStr(stat);
      const zone = classifyRoll(user, { min, q1, q3, max });

      return { stat: label, min, p10, q1, median, q3, p90, max, user, violin, zone };
    })
    .sort((a, b) => b.median - a.median);

  const ViolinShape = (props) => {
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
        <path d={pathD} fill={alpha(accent, 0.55)} stroke={accent} strokeWidth={1} />
        {/* thin IQR bar + median tick, same as the original box plot */}
        <line x1={cx} x2={cx} y1={q1Y} y2={q3Y} stroke={palette.text.primary} strokeWidth={3} strokeOpacity={0.6} />
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
  };

  const scatterFill = (zone) => {
    if (zone === 'ideal') return palette.success.main;
    if (zone === 'acceptable') return palette.warning.main;
    return palette.error.main;
  };

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title="Substat Distribution"
        action={
          <FormControlLabel
            control={
              <Switch
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
              />
            }
            label="Show all"
            labelPlacement="start"
            sx={{ mr: 1 }}
          />
        }
      />
      <CardContent component={Stack} direction="row" sx={{ flex: 1 }}>
        <BarChart data={data} style={{ width: '100%', height: '100%' }} responsive>
          <XAxis
            type="category"
            dataKey="stat"
            tick={{ fontSize: 11 }}
            allowDuplicatedCategory={false}
            tickFormatter={(label) => (label.length > 12 ? `${label.slice(0, 11)}…` : label)}
          />
          <YAxis type="number" tickCount={6} domain={AXIS_DOMAIN} />

          <Bar dataKey={violinDataKey} name="Rolls" shape={ViolinShape} fillOpacity={1} />

          <Scatter
            data={data}
            dataKey="user"
            name="Your Rolls"
            animationEasing="ease"
            shape={(props) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={scatterFill(payload.zone)}
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
                  <Typography variant="subtitle2">{label}</Typography>
                  {entry && (
                    <Stack>
                      {[
                        ['Max', entry.max],
                        ['P90', entry.p90],
                        ['Q3', entry.q3],
                        ['Median', entry.median],
                        ['Q1', entry.q1],
                        ['P10', entry.p10],
                        ['Min', entry.min],
                        ['Your Roll', entry.user],
                      ].map(([name, value]) => (
                        <Stack key={name} direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="textSecondary">{name}:</Typography>
                          <Typography variant="caption">{Number(value).toFixed(1)}</Typography>
                        </Stack>
                      ))}
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
          />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default Substats;
