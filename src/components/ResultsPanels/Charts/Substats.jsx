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
  ErrorBar,
  Rectangle,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
  matchByDataKey,
} from 'recharts';
import { WW, SUBSTAT } from '@/data';
import { useAccent } from '@/hooks';
import { formatStr } from '@/utils';
import { mean } from 'simple-statistics';

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
  const totalSubRolls =
    Object.values(subDist)
      .reduce((acc, rollsList) => acc + mean(rollsList) , 0);

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

    return getFrequency(stat) > unbiasedFrequency
  };
};

const quantile = (sorted, q) => {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] !== undefined
    ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
    : sorted[base];
};

const getBoxStats = (rolls = []) => {
  if (rolls.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [] };
  }

  const sorted = [...rolls].sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25);
  const median = quantile(sorted, 0.5);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  const inRange = sorted.filter((v) => v >= lowerFence && v <= upperFence);
  const outliers = sorted.filter((v) => v < lowerFence || v > upperFence);

  return {
    min: inRange[0] ?? sorted[0],
    q1,
    median,
    q3,
    max: inRange[inRange.length - 1] ?? sorted[sorted.length - 1],
    outliers,
  };
};

// [q1, q3] -> box body
const boxDataKey = (entry) => [entry.q1, entry.q3];
// offsets from the box edges to the whisker ends
const whiskerDataKey = (entry) => [entry.q3 - entry.min, entry.max - entry.q3];

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
      const { min, q1, median, q3, max, outliers } = getBoxStats(subDist[stat]);
      const user = userSubStats[stat] ?? 0;
      const label = formatStr(stat);

      return {
        stat: label,
        min,
        q1,
        median,
        q3,
        max,
        user,
        pct: median > 0 ? (user / median) * 100 : 0,
        outlierPoints: outliers.map((value) => ({ stat: label, value })),
      };
    })
    .sort((a, b) => b.median - a.median);

  const BoxShape = (props) => {
    const entry = data.find((d) => d.stat === props.stat) ?? props;
    const quartileRange = entry.q3 - entry.q1;
    const medianOffset =
      quartileRange === 0
        ? props.height / 2
        : ((entry.q3 - entry.median) / quartileRange) * props.height;
    const medianY = props.y + medianOffset;

    return (
      <g>
        <Rectangle {...props} fill={alpha(accent, 0.6)} />
        <line
          x1={props.x}
          x2={props.x + props.width}
          y1={medianY}
          y2={medianY}
          stroke={palette.text.primary}
          strokeWidth={2}
        />
      </g>
    );
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
            tickFormatter={(label) => label.length > 16
              ? `${label.slice(0, 15)}…`
              : label
            }
          />
          <YAxis type="number" tickCount={6} domain={[0, 5]} />

          <Bar
            dataKey={boxDataKey}
            name="Rolls"
            shape={BoxShape}
            fillOpacity={1}
          >
            <ErrorBar
              dataKey={whiskerDataKey}
              animationBegin={400}
              width={6}
              strokeWidth={2}
              stroke={palette.text.primary}
            />
          </Bar>

          <Scatter
            data={data}
            dataKey="user"
            name="Your Rolls"
            animationEasing="ease"
            shape={(props) => {
              const { cx, cy, payload } = props;
              const inIqr = payload.user >= payload.q1 && payload.user <= payload.q3;
              const fill = inIqr ? palette.success.main : palette.error.main;
              return <circle cx={cx} cy={cy} r={5} fill={fill} stroke={palette.background.paper} strokeWidth={1} />;
            }}
          />

          <Tooltip
            content={({ payload, label }) => {
              const boxPayload = payload?.find((p) => p.dataKey === boxDataKey || p.name === 'Rolls');
              const entry = boxPayload?.payload;
              return (
                <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
                  <Typography variant="subtitle2">{label}</Typography>
                  {entry && (
                    <Stack>
                      {[
                        ['Max', entry.max],
                        ['Q3', entry.q3],
                        ['Median', entry.median],
                        ['Q1', entry.q1],
                        ['Min', entry.min],
                        ['Your Roll', entry.user],
                      ].map(([name, value]) => (
                        <Stack key={name} direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="textSecondary">{name}:</Typography>
                          <Typography variant="caption">{Number(value).toFixed(1)}</Typography>
                        </Stack>
                      ))}
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
