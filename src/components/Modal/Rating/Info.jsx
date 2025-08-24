import { Paper, Box, Typography, Divider, Stack } from '@mui/material';
import { AVATAR_ASSETS, RATING_ASSETS } from '@assets';
import { AVATAR_DATA, INFO_DATA, STAT_DATA } from '@data';

const Info = ({ gameId, avatarId, index, ratingData, stat }) => {
  const { score, q3, percentile } = ratingData;

  const times_for_specific_piece = (10000 / (10000 - (percentile * 100)));
  const times_for_piece = (times_for_specific_piece / STAT_DATA[gameId][stat].mainChance[index]);
  const domain_runs = times_for_piece * INFO_DATA[gameId].MAIN_LEN * 2;

  return (
    <Paper sx={{ p: 3, width: 300 }}>
      <Typography variant="h6" color="primary">
        Simulation Results:
      </Typography>
      <Typography variant="body2">
        Total Score: {score.toFixed()}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Percentile: {percentile.toFixed(2)}%
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Q3: {q3.toFixed()}%
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        It will take approximately {domain_runs.toFixed()} domain runs to get a better {INFO_DATA[gameId].EQUIP_NAMES[index]}. ({(domain_runs / 6).toFixed()} days)
      </Typography>
    </Paper>
  );
};

export default Info;
