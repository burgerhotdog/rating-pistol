import { useParams } from 'react-router-dom';
import {
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
  BarChart,
  LabelList,
  Rectangle,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { WW, SUBSTAT } from '@/data';
import { useAccent } from '@/hooks';
import { formatStr } from '@/utils';

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

const Substats = ({ results }) => {
  const { configMap, userConfigKey, userSubStats } = results;
  const { gameId } = useParams();
  const { palette } = useTheme();
  const accent = useAccent();

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
        <BarChart
          data={data}
          style={{ width: '100%', height: '100%' }}
          responsive
        >
          <XAxis type="category" dataKey="stat" tick={{ fontSize: 11 }} />
          <YAxis type="number" />

          <Bar
            dataKey="avg"
            name="Benchmark"
            fill={alpha(accent, 0.6)}
          />

          <Bar
            dataKey="user"
            name="Your Rolls"
            shape={(props) => {
              const { index, ...rest } = props;
              const entry = data[index];
              const fill = entry.pct >= 100 ? palette.success.main : palette.error.main;
              return <Rectangle {...rest} fill={fill} />;
            }}
          >
            <LabelList
              dataKey="pct"
              position="right"
              formatter={(v) => `${v.toFixed(0)}%`}
              style={{ fontSize: 10, fill: palette.text.secondary }}
            />
          </Bar>

          <Tooltip
            content={({ payload, label }) => (
              <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
                <Typography variant="subtitle2">
                  {label}
                </Typography>
                {payload.map((p) => (
                  <Stack
                    key={p?.name}
                    direction="row"
                    spacing={1}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      {p?.name}:
                    </Typography>
                    <Typography variant="caption">
                      {Number(p?.value).toFixed(1)} rolls
                    </Typography>
                  </Stack>
                ))}
              </Paper>
            )}
          />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default Substats;
