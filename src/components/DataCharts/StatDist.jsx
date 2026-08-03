import { useParams } from 'react-router-dom';
import { Avatar, Stack, IconButton, Box, Card, CardHeader, Tooltip, Typography, Paper } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { ATTR_ASSETS } from '@/assets';
import { FlexRow, FlexCol, FlexCard } from '@/components';
import { WW, CHARACTER, SUBSTAT } from '@/data';
import { formatStr } from '@/utils';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { ChartFill } from '../Layout';

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

const IconRow = ({ gameId, slots }) => {
  return (
    <Card>
      {slots.map((statId, i) =>
        <Tooltip key={i} title={formatStr(statId)}>
          <IconButton>
            <Avatar
              src={ATTR_ASSETS[gameId][statId.replace('%', '')]}
              alt={formatStr(statId)}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Tooltip>
      )}
    </Card>
  )
};

const USER_COLOR = '#BA7517';

const ConfigRow = ({ gameId, configKey, isUser, pct }) => {
  const slots = configKey.split('|');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: 1.5,
        border: '0.5px solid',
        borderColor: isUser ? alpha(USER_COLOR, 0.35) : isUser ? 'divider' : 'transparent',
        bgcolor: isUser ? alpha(USER_COLOR, 0.06) : isUser ? 'action.hover' : 'transparent',
        cursor: 'pointer',
        transition: 'background-color 0.15s',
        '&:hover': {
          bgcolor: isUser ? alpha(USER_COLOR, 0.09) : 'action.hover',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box sx={{ display: 'flex', flex: 1, flexWrap: 'wrap' }}>
          <IconRow gameId={gameId} slots={slots} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
          {isUser && (
            <Box sx={{
              bgcolor: alpha(USER_COLOR, 0.12),
              color: USER_COLOR,
              border: '0.5px solid',
              borderColor: alpha(USER_COLOR, 0.4),
              borderRadius: 0.75,
              px: 0.75,
              fontSize: 10,
              fontWeight: 500,
              lineHeight: 1.8,
            }}>
              you
            </Box>
          )}

          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ minWidth: 30, textAlign: 'right' }}
          >
            {(pct * 100).toFixed(0)}%
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: '5px', bgcolor: 'divider', borderRadius: 1, mx: 0.25 }}>
        <Box
          sx={{
            height: '100%',
            width: `${pct * 100}%`,
            bgcolor: isUser ? USER_COLOR : 'primary.main',
            borderRadius: 1,
          }}
        />
      </Box>
    </Box>
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

export const StatDist = ({ configMap, userConfigKey, userSubStats }) => {
  const { gameId, charId } = useParams();
  const { accentColors } = useTheme();
  const { element } = CHARACTER[gameId][charId];
  const elementColor = accentColors[gameId][element];
  if (!configMap) return null;

  const entries = Object.entries(configMap);
  const total = entries.reduce((sum, [, c]) => sum + c.count, 0);
  const sorted = entries.slice().sort(([, a], [, b]) => b.count - a.count);
  const userIdx = sorted.findIndex(([k]) => k === userConfigKey);

  const ordered = userIdx >= 0
    ? [sorted[userIdx], ...sorted.filter((_, i) => i !== userIdx)]
    : sorted;

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
    <FlexCol>
      <FlexCard>
        <CardHeader
          title={
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <Typography variant="subtitle1">
                Main stat distribution
              </Typography>

              <Tooltip
                title="Top main stat combinations in simulated builds."
              >
                <HelpOutlineOutlinedIcon
                  color="disabled"
                />
              </Tooltip>
            </Stack>
          }
          disableTypography
        />

        <Box sx={{ px: 1, pb: 1, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {ordered.map(([key, config]) => (
            <ConfigRow
              key={key}
              gameId={gameId}
              configKey={key}
              isUser={key === userConfigKey}
              pct={config.count / total}
            />
          ))}
        </Box>
      </FlexCard>

      <FlexCard>
        <CardHeader
          title={
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <Typography variant="subtitle1">
                Sub stat distribution
              </Typography>

              <Tooltip
                title="Substat distribution comparison with average."
              >
                <HelpOutlineOutlinedIcon
                  color="disabled"
                />
              </Tooltip>
            </Stack>
          }
          disableTypography
        />

        <FlexRow>
          <ChartFill>
            <RadarChart
              responsive
              data={data}
              outerRadius="70%"
              margin={{
                top: 16,
                left: 48,
                right: 48,
                bottom: 16,
              }}
            >
              <PolarGrid />
              <PolarAngleAxis
                dataKey="stat"
                tick={{ fontSize: 9 }}
              />
              <Radar
                dataKey="user"
                stroke={elementColor}
                fill={elementColor}
                fillOpacity={0.6}
              />
            </RadarChart>
          </ChartFill>

          <ChartFill>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ left: 16, right: 16, top: 8, bottom: 8 }}
            >
              <XAxis
                type="number"
                tickFormatter={(v) => v.toFixed(1)}
              />
    
              <YAxis
                type="category"
                dataKey="stat"
                width="auto"
                tick={{ fontSize: 11 }}
              />
    
              <RechartsTooltip content={CustomTooltip} />
    
              <Bar
                dataKey="avg"
                name="Benchmark"
                fill={alpha(elementColor, 0.6)}
              />
            </BarChart>
          </ChartFill>
        </FlexRow>
      </FlexCard>
    </FlexCol>
  );
};