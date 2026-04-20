import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, Paper } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { MISC, CHARACTERS } from '@/data';
import { computeDamage } from '@/utils';
import { useTheme } from '@mui/material/styles';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as Tooltip2,
  Cell,
} from 'recharts';

export const CustomTable = ({ gameId, characterId, build, rating, team, isLoading }) => {
  const theme = useTheme();
  const element = CHARACTERS[gameId]?.[characterId]?.element;
  const elementColor = MISC[gameId]?.ELEMENT_COLORS?.[element] ?? '#8884d8';
  const { SUB_STAT_TYPES } = MISC[gameId];
  const { calcs } = CHARACTERS[gameId][characterId];
  if (isLoading || !calcs || !build) return null;

  const newRatings = Object.entries(SUB_STAT_TYPES)
    .map(([id, { VALUE }]) => {
      const newRating = computeDamage(gameId, characterId, { ...build, equipList: [...build.equipList, { mainStatId: id, mainStatValue: VALUE, subStatList: [] }] }, calcs[0], team);
      return {
        name: id,
        diff: newRating / rating * 100 - 100,
      };
    })
    .filter(({ diff }) => diff)
    .sort(({ diff: a }, { diff: b }) => b - a);

  const maxDiff = newRatings.length ? newRatings[0].diff : 1;

  const chartData = newRatings.map(({ name, diff }) => ({
    name: SUB_STAT_TYPES[name].NAME,
    value: diff,
  }));

  return (
    <Card sx={{ flex: 1, overflow: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 2, pt: 1.5, pb: 0.5 }}>
        <Typography variant="subtitle2" fontWeight="bold">Substat Priority</Typography>
        <Tooltip title="Damage increase from gaining one extra roll of each substat. Prioritize farming for the stats at the top." placement="top" arrow>
          <HelpOutlineIcon sx={{ fontSize: 13, color: 'text.disabled', cursor: 'help' }} />
        </Tooltip>
      </Box>
      <Box sx={{ width: '100%', height: 220, px: 2, pb: 2 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <XAxis
              type="number"
              tickFormatter={(v) => `+${v.toFixed(1)}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
            />
            <Tooltip2
              formatter={(value) => `+${value.toFixed(2)}%`}
            />
            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={elementColor}
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
