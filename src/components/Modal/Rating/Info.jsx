import { Paper, Box, Typography, Divider, Stack } from '@mui/material';
import { AVATAR_ASSETS, RATING_ASSETS } from '@assets';
import { AVATAR_DATA, INFO_DATA, STAT_DATA } from '@data';
import daysToFarm from './daysToFarm';

const Info = ({ gameId, avatarId, index, ratingData, stat }) => {
  const { score, percentile, scoreMax } = ratingData;

  const times_for_specific_piece = (10000 / (10000 - (percentile * 100)));
  const times_for_piece = (times_for_specific_piece / STAT_DATA[gameId][stat].mainChance[index]);
  const days = daysToFarm(gameId, percentile, stat, index);

  return (
    <Paper sx={{ p: 3, width: 300 }}>
      <Typography variant="h6" color="primary">
        Simulation Results:
      </Typography>
      <Typography variant="body2">
        Substat Score: {score.toFixed()}
      </Typography>
      <Typography variant="body2"color="text.secondary">
        Benchmark Score: {scoreMax.toFixed()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Percentile: {percentile.toFixed(2)}%
      </Typography>
      <Typography variant="body2" color="text.secondary">
        It would take approximately {days.toFixed()} days to farm a better {INFO_DATA[gameId].EQUIP_NAMES[index]}.
      </Typography>
    </Paper>
  );
};

export default Info;
