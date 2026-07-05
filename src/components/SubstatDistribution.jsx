import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CardHeader, Stack, Paper, Tooltip, Typography, Switch, FormControlLabel } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { FlexCard, ChartFill } from '@/components';
import { WW, MISC, CHARACTER } from '@/data';
import { formatStr } from '@/utils';
import { HOYO_SUBSTAT_WEIGHTS } from '@/workers/simulation/statWeights';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper elevation={4} sx={{ p: 1.5, border: 1, borderColor: 'divider', minWidth: 160 }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        {label}
      </Typography>

      {payload.map(p => (
        <Box key={p.name} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: 0.5, bgcolor: p.fill }} />
            <Typography variant="body2" color="text.secondary">{p.name}</Typography>
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
    if (pool.every(([name]) => name !== stat)) {
      return 0;
    }

    if (remainingDraws === 0) {
      return 0;
    }

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

const isSignificantStat = (gameId, statId, percentOftotal, mainStatsList) => {
  if (gameId === WW) {
    return percentOftotal > (11899 / 128700);
  }

  const weights = Object.entries(HOYO_SUBSTAT_WEIGHTS[gameId]);

  const baseChances = mainStatsList.map((mainStat) => {
    const withoutMain = weights.filter(([key]) => key !== mainStat);
    return chanceOfStat(withoutMain, statId);
  });

  const avgRolls = baseChances
    .map(chance => chance * 2.05)
    .reduce((acc, chance) => acc + chance, 0);

  const unbiasedPercentOfTotal = avgRolls / 41;
  
  return percentOftotal > unbiasedPercentOfTotal;
};

export const SubstatDistribution = ({ configMap, userConfigKey, userSubStats }) => {
  const { gameId, characterId } = useParams();
  const { accentColors } = useTheme();
  const { element } = CHARACTER[gameId][characterId];
  const [showAll, setShowAll] = useState(false);
  if (!configMap) return null;

  const { subRollSums = {} } = configMap[userConfigKey] ?? {};
  const subStatTypes = MISC[gameId].SUB_STAT_TYPES;

  const totalRolls = Object.values(subRollSums)
    .reduce((acc, rolls) => acc + rolls , 0);

  const chartData = Object.keys(subStatTypes)
    .map((statId) => ({
      id: statId,
      name: formatStr(statId),
      sim: subRollSums[statId] ?? 0,
      user: userSubStats[statId] ?? 0,
    }))
    .filter(({ id, sim }) => showAll || isSignificantStat(gameId, id, sim / totalRolls, (userConfigKey ?? '').split('|')))
    .sort((a, b) => b.sim - a.sim);

  const elementColor = accentColors[gameId][element];
  const maxValue = Math.max(...chartData.flatMap(d => [d.sim, d.user]));

  return (
    <FlexCard>
      <CardHeader
        title={
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="subtitle1">
              Substat distribution
            </Typography>

            <Tooltip title="Shows the average distribution of substat rolls across final builds.">
              <HelpOutlineOutlinedIcon color="disabled" />
            </Tooltip>

            <FormControlLabel
              control={
                <Switch
                  checked={showAll}
                  onChange={(e) => setShowAll(e.target.checked)}
                />
              }
              label="Show all stats"
            />
          </Stack>
        }
        disableTypography
      />

      <ChartFill>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ left: 16, right: 16, top: 8, bottom: 8 }}
        >
          <XAxis
            type="number"
            domain={[0, maxValue * 1.1]}
            tickFormatter={(v) => v.toFixed(1)}
          />

          <YAxis
            type="category"
            dataKey="name"
            width="auto"
            tick={{ fontSize: 11 }}
          />

          <RechartsTooltip content={CustomTooltip} />

          <Legend />

          <Bar
            dataKey="sim"
            name="Benchmark"
            fill={alpha(elementColor, 0.3)}
          />

          <Bar
            dataKey="user"
            name="You"
            fill={elementColor}
          />
        </BarChart>
      </ChartFill>
    </FlexCard>
  );
};
