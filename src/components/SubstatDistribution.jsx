import { useParams } from 'react-router-dom';
import { Box, CardHeader, Stack, Paper, Tooltip, Typography } from '@mui/material';
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
import { MISC, CHARACTER } from '@/data';
import { formatStr } from '@/utils';

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

export const SubstatDistribution = ({ configMap, selectedKey, userSubStats }) => {
  const { gameId, characterId } = useParams();
  const theme = useTheme();
  const { element } = CHARACTER[gameId][characterId];
  if (!configMap) return null;

  const { subRollSums = {} } = configMap[selectedKey] ?? {};
  const subStatTypes = MISC[gameId].SUB_STAT_TYPES;

  const chartData = Object.keys(subStatTypes).map(statId => ({
    name: formatStr(statId),
    sim: subRollSums[statId] ?? 0,
    user: userSubStats[statId] ?? 0,
  })).sort((a, b) => b.sim - a.sim);

  const elementColor = theme.accentColor[gameId][element];
  const maxValue = Math.max(...chartData.flatMap(d => [d.sim, d.user]));

  return (
    <FlexCard>
      <CardHeader
        title={
          <Stack direction="row" spacing={0.5}>
            <Typography variant="subtitle1">
              Substat distribution
            </Typography>

            <Tooltip
              title="Shows the average distribution of substat rolls across final builds."
              placement="top"
              arrow
            >
              <HelpOutlineOutlinedIcon
                fontSize="small"
                color="disabled"
              />
            </Tooltip>
          </Stack>
        }
        disableTypography
      />

      <ChartFill>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 16, left: 0, bottom: 44 }}
        >
          <XAxis
            type="category"
            dataKey="name"
            interval={0}
            angle={-35}
            tickMargin={4}
            tick={{ fontSize: 10, textAnchor: 'end' }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            type="number"
            domain={[0, maxValue * 1.1]}
            tickFormatter={(v) => v.toFixed(1)}
            tick={{ fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            width={28}
          />

          <RechartsTooltip
            allowEscapeViewBox={{ x: true, y: true }}
            wrapperStyle={{ pointerEvents: 'none', zIndex: 10 }}
            content={CustomTooltip}
          />

          <Legend
            iconType="square"
            iconSize={8}
            verticalAlign="top"
            wrapperStyle={{ fontSize: 11, paddingBottom: 4 }}
          />

          <Bar
            dataKey="sim"
            name="Sim avg"
            fill={alpha(elementColor, 0.3)}
            radius={[3, 3, 0, 0]}
            maxBarSize={28}
          />

          <Bar
            dataKey="user"
            name="Your build"
            fill={elementColor}
            radius={[3, 3, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ChartFill>
    </FlexCard>
  );
};
