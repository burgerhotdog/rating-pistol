import { useParams } from 'react-router-dom';
import { Box, Card, Paper, Tooltip, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as Tooltip2,
  Cell,
} from 'recharts';
import { MISC, CHARACTERS } from '@/data';
import { useSimulateRotation } from '@/hooks';
import { simulateRotation, normalizeTeam, sumRotationDmg } from '@/utils';

export const SubstatPriority = ({ isLoading, team, teamFinalStats }) => {
  const { gameId, characterId } = useParams();
  const { element } = CHARACTERS[gameId][characterId];
  const rating = sumRotationDmg(useSimulateRotation(team, teamFinalStats), { ownerId: characterId });
  if (isLoading) return null;

  const newRatings = Object.entries(MISC[gameId].SUB_STAT_TYPES)
    .map(([id, { VALUE }]) => {
      const teamWithSubstat = team.map(m => {
        if (m.memberId !== characterId) return m;
        return {
          ...m,
          build: {
            ...m.build,
            equipList: [
              ...m.build.equipList,
              { mainStatId: id, mainStatValue: VALUE, subStatList: [] },
            ],
          },
        };
      });
      const normalizedTeam = normalizeTeam(teamWithSubstat, teamFinalStats);
      const actionMap = simulateRotation(gameId, normalizedTeam);
      const newRating = sumRotationDmg(actionMap, { ownerId: characterId });
      return {
        name: id,
        diff: newRating / rating * 100 - 100,
      };
    })
    .filter(({ diff }) => diff)
    .sort(({ diff: a }, { diff: b }) => b - a);

  const maxDiff = newRatings.length ? newRatings[0].diff : 1;

  const chartData = newRatings.map(({ name, diff }) => ({
    name: MISC[gameId].SUB_STAT_TYPES[name].NAME,
    value: diff,
  }));

  const yAxisWidth = Math.min(
    180,
    Math.max(100, Math.max(...chartData.map(({ name }) => name.length), 0) * 7 + 16)
  );
  const chartViewportHeight = 220;
  const itemCount = Math.max(chartData.length, 1);
  const availableBarArea = chartViewportHeight - 44;
  const barSize = Math.max(3, Math.min(18, Math.floor(availableBarArea / itemCount) - 2));
  const barCategoryGap = Math.max(1, Math.min(10, Math.floor(barSize * 0.4)));

  const renderYAxisTick = ({ x, y, payload }) => (
    <foreignObject x={x - yAxisWidth + 6} y={y - 10} width={yAxisWidth - 12} height={20}>
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Typography
          noWrap
          title={payload.value}
          sx={{
            maxWidth: '100%',
            fontSize: 12,
            lineHeight: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'text.secondary',
          }}
        >
          {payload.value}
        </Typography>
      </Box>
    </foreignObject>
  );

  return (
    <Card sx={{ flex: 1, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 2, pt: 1.5, pb: 0.5 }}>
        <Typography variant="subtitle2" fontWeight="bold">Substat Priority</Typography>
        <Tooltip title="Damage increase from gaining one extra roll of each substat. Prioritize farming for the stats at the top." placement="top" arrow>
          <HelpOutlineIcon sx={{ fontSize: 13, color: 'text.disabled', cursor: 'help' }} />
        </Tooltip>
      </Box>
      <Box sx={{ width: '100%', height: chartViewportHeight, px: 2, pb: 2 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            barCategoryGap={barCategoryGap}
          >
            <XAxis
              type="number"
              tickFormatter={(v) => `+${v.toFixed(1)}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={yAxisWidth}
              interval={0}
              tickMargin={6}
              tick={renderYAxisTick}
            />
            <Tooltip2
              allowEscapeViewBox={{ x: true, y: true }}
              wrapperStyle={{ pointerEvents: 'none', zIndex: 10 }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const value = payload[0].value;
                return (
                  <Paper
                    elevation={4}
                    sx={{
                      p: 1.5,
                      minWidth: 0,
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Damage gain: +{Number(value).toFixed(2)}%
                    </Typography>
                  </Paper>
                );
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={barSize}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={MISC[gameId].ELEMENT_COLORS[element]}
                  opacity={0.4 + 0.6 * (entry.value / maxDiff)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};
