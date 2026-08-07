import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Bar,
  Cell,
  Legend,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart, RadarChart } from '@/components';
import { WW, SUBSTAT } from '@/data';
import { useElementColors } from '@/hooks';
import { formatStr } from '@/utils';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper elevation={4} sx={{ p: 1.5, border: 1, borderColor: 'divider', minWidth: 160 }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        {label}
      </Typography>

      {payload.map((p) => (
        <Box key={p.name} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: 0.5, bgcolor: p.fill }} />

            <Typography variant="body2" color="textSecondary">
              {p.name}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {Number(p.value).toFixed(1)} rolls
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

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
      .reduce((acc, rolls) => acc + rolls , 0);

  function getFrequency(stat) {
    return (subDist[stat] ?? 0) / totalSubRolls;
  }

  if (gameId === WW) {
    const unbiasedFrequency = 11899 / 128700;
    return (stat) => getFrequency(stat) > unbiasedFrequency;
  }

  const mainStatsList = configKey.split('|');

  return (stat) => {
    const baseChances = mainStatsList.map((mainStat) => {
      const weights = Object.values(SUBSTAT[gameId])
        .filter(({ id }) => id !== mainStat)
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

const MAX_CHARS_PER_LINE = 10;

function wrapLabel(value, maxChars = MAX_CHARS_PER_LINE) {
  const words = String(value).split(' ');
  const lines = [];
  let current = '';

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });
  if (current) lines.push(current);
  return lines;
}

function CustomPolarAngleAxisTick({ x, y, payload, textAnchor, color }) {
  const lines = wrapLabel(payload.value);
  const lineHeight = 12;
  // vertically center the multi-line block on the original tick position
  const startDy = -((lines.length - 1) * lineHeight) / 2;

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      fontSize={11}
      fill={color}
    >
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? startDy : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

const Substats = ({ configMap, userConfigKey, userSubStats }) => {
  const { gameId } = useParams();
  const { palette } = useTheme();
  const color = useElementColors({ char: '$curr' });
  if (!configMap) return null;

  const { subDist = {} } = configMap[userConfigKey] ?? {};

  const subFilter = createSubFilter(gameId, userConfigKey, subDist);

  const data = Object.keys(SUBSTAT[gameId])
    .filter(subFilter)
    .map((stat) => {
      const avgRolls = subDist[stat];
      const userRolls = userSubStats[stat] ?? 0;

      return {
        stat: formatStr(stat),
        user: userRolls,
        avg: avgRolls,
        pct: userRolls / avgRolls * 100,
      };
    })
    .sort((a, b) => b.avg - a.avg);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader title="Substat Distribution" />
      <CardContent component={Stack} direction="row" sx={{ flex: 1 }}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="stat" tick={<CustomPolarAngleAxisTick color={palette.text.disabled} />} />
          <Radar
            dataKey="user"
            stroke={color}
            fill={color}
            fillOpacity={0.6}
          />
        </RadarChart>

        <BarChart
          layout="vertical"
          data={data}
        >
          <XAxis
            type="number"
            tickFormatter={(v) => v.toFixed(1)}
          />

          <YAxis
            type="category"
            dataKey="stat"
            tick={{ fontSize: 11 }}
          />

          <RechartsTooltip content={CustomTooltip} />
          <Legend wrapperStyle={{ fontSize: 11 }} />

          <Bar
            dataKey="avg"
            name="Benchmark"
            fill={alpha(color, 0.6)}
          />
          <Bar
            dataKey="user"
            name="Your Rolls"
            fill={color}
          >
            {data.map((entry) => (
              <Cell key={entry.stat} fill={entry.pct >= 100 ? palette.success.main : palette.error.main} />
            ))}
            <LabelList
              dataKey="pct"
              position="right"
              formatter={(v) => `${v.toFixed(0)}%`}
              style={{ fontSize: 10, fill: palette.text.secondary }}
            />
          </Bar>
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default Substats;
