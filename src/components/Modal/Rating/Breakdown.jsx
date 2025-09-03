import { Paper, Box, Typography, Divider, Stack } from '@mui/material';
import { AVATAR_DATA, STAT_DATA } from '@data';

export default ({ gameId, avatarId, ratingData, mainstat, statList }) => {
  const { rolls } = ratingData;
  const { weights } = AVATAR_DATA[gameId][avatarId];
  const statData = STAT_DATA[gameId];

  const Row = ({ stat, value }) => {
    const isFlat = stat[0] === '_';
    const weight = weights[isFlat ? stat.slice(1) : stat];
    const color = !!weight ? 'text.primary' : 'text.disabled';
    return (
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body2" color={color} sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '130px',
        }}>
          {statData[stat].name}
        </Typography>
        <Typography variant="body2" color={color}>
          {!!weight && (
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
            >
              {weight.toFixed(2)}{' x '}
            </Typography>
          )}
          {(value / statData[stat].subValue).toFixed(1)}
        </Typography>
      </Box>
    );
  };

  return (
    <Paper sx={{
      display: 'flex',
      flexDirection: 'column',
      width: 250,
      p: 3,
      gap: 0.5,
    }}>
      <Typography variant="h6" color="primary">
        {statData[mainstat].name}
      </Typography>
      <Divider />
      <Stack>
        {statList.map(({ stat, value }, index) => (
          <Row key={index} stat={stat} value={value} />
        ))}
      </Stack>
      <Divider />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body2" color="primary">
          Weighted Rolls:
        </Typography>
        <Typography variant="body2" color="primary">
          {rolls.toFixed(1)}
        </Typography>
      </Box>
    </Paper>
  );
};
