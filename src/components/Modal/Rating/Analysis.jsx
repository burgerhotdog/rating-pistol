import { Paper, Stack, Box, Typography } from '@mui/material';
import { getPercentile } from '@utils';
import daysToFarm from './daysToFarm';
import ColorBar from './ColorBar';

const formatDays = (days) => {
  if (!Number.isFinite(days)) return '∞';

  const years = Math.floor(days / 365);
  const remDays = Math.floor(days % 365);

  const parts = [];
  if (years > 0) parts.push(`${years}y`);
  if (remDays > 0) parts.push(`${remDays}d`);

  return parts.length > 0 ? parts.join(' ') : '0d';
}

const colorDays = (days) => {
  if (!Number.isFinite(days)) return 100;
  if (days < 7) return days / 7 * (100 / 3);
  if (days < 30) return (days - 7) / (30 - 7) * (100 / 3) + (100 / 3);
  if (days < 365) return (days - 30) / (365 - 30) * (100 / 3) + (200 / 3);
  return 100;
};

export default ({ gameId, index, ratingData, stat }) => {
  const { rolls, dataset } = ratingData;
  const percentile = getPercentile(rolls, dataset);
  const days = daysToFarm(gameId, percentile, stat, index);

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', p: 3, gap: 2 }}>
      <Stack gap={1}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Percentile:
          </Typography>
          <Typography variant="body2" color="text.primary">
            {percentile.toFixed(1)}
          </Typography>
        </Box>
        <ColorBar value={percentile} />
      </Stack>
      <Stack gap={1}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Farming time:
          </Typography>
          <Typography variant="body2" color="text.primary">
            {formatDays(days)}
          </Typography>
        </Box>
        <ColorBar value={colorDays(days)} reverse />
      </Stack>
    </Paper>
  );
};
