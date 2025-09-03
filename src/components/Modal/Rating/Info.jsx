import { Paper, Box, Typography, Divider, Stack } from '@mui/material';
import { AVATAR_DATA, INFO_DATA, STAT_DATA } from '@data';
import { getPercentile } from '@utils';
import daysToFarm from './daysToFarm';

const Info = ({ gameId, avatarId, index, ratingData, stat }) => {
  const { rolls, max, dataset } = ratingData;
  const percentile = getPercentile(rolls, dataset);
  const days = daysToFarm(gameId, percentile, stat, index);

  return (
    <Paper sx={{ p: 3, width: 300 }}>
      <Typography variant="h6" color="primary">
        Simulation Results:
      </Typography>
      <Typography variant="body2">
        Weighted Rolls: {rolls.toFixed(2)}
      </Typography>
      <Typography variant="body2"color="text.secondary">
        Max Rolls: {max.toFixed(2)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Percentile: {percentile.toFixed(2)}%
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Refarm time: {days.toFixed()} days
      </Typography>
    </Paper>
  );
};

export default Info;
