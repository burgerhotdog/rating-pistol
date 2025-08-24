import { Paper, Box, Typography, Divider, Stack } from '@mui/material';
import { AVATAR_ASSETS, RATING_ASSETS } from '@assets';
import { AVATAR_DATA, INFO_DATA, STAT_DATA } from '@data';

const how_many_days = {
  gi: (pieces) => {
    const types_of_pieces = 5;
    const pieces_per_run = 1.25;
    const runs = (pieces * types_of_pieces) / (pieces_per_run / 2);
    const resin_per_run = 20;
    const resin_per_day = 200;
    const days = (runs * resin_per_run) / resin_per_day;
    return [runs, days];
  },
  hsr: (pieces) => {
    const types_of_pieces = 3;
    const pieces_per_run = 2.25;
    const runs = (pieces * types_of_pieces) / (pieces_per_run / 2);
    const resin_per_run = 40;
    const resin_per_day = 240;
    const days = (runs * resin_per_run) / resin_per_day;
    return [runs, days];
  },
  ww: (pieces) => {
    const types_of_pieces = 2;
    const pieces_per_run = 5;
    const runs = (pieces * types_of_pieces) / (pieces_per_run / 2);
    const resin_per_run = 60;
    const resin_per_day = 240;
    const days = (runs * resin_per_run) / resin_per_day;
    return [runs, days];
  },
  zzz: (pieces) => {
    const types_of_pieces = 6;
    const pieces_per_run = 2.5;
    const runs = (pieces * types_of_pieces) / (pieces_per_run / 2);
    const resin_per_run = 60;
    const resin_per_day = 320;
    const days = (runs * resin_per_run) / resin_per_day;
    return [runs, days];
  },
};

const Info = ({ gameId, avatarId, index, ratingData, stat }) => {
  const { score, q3, percentile } = ratingData;

  const times_for_specific_piece = (10000 / (10000 - (percentile * 100)));
  const times_for_piece = (times_for_specific_piece / STAT_DATA[gameId][stat].mainChance[index]);

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
        It will take approximately {how_many_days[gameId](times_for_piece)[0].toFixed()} domain runs to get a better {INFO_DATA[gameId].EQUIP_NAMES[index]}. ({how_many_days[gameId](times_for_piece)[1].toFixed()} days)
      </Typography>
    </Paper>
  );
};

export default Info;
