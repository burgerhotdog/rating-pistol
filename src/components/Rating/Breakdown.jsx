import { Paper, Box, Typography, Divider, Stack } from '@mui/material';
import { AVATAR_DATA, STAT_DATA } from '@/data';

export default ({ gameId, avatarId, ratingData, mainstat, subStatList }) => {
  const { rolls } = ratingData;
  const { weights } = AVATAR_DATA[gameId][avatarId];
  const statData = STAT_DATA[gameId];

  const Row = ({ subStatId, value }) => {
    const isFlat = subStatId[0] === '_';
    const weight = weights[isFlat ? subStatId.slice(1) : subStatId];
    const color = !!weight ? 'text.primary' : 'text.disabled';
    return (
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body2" color={color} sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '130px',
        }}>
          {statData[subStatId].name}
        </Typography>
        <Typography variant="body2" color={color}>
          {!!weight && (
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
            >
              {weight.toFixed(1)}{' x '}
            </Typography>
          )}
          {(value / statData[subStatId].subValue).toFixed(1)}
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
      gap: 1,
    }}>
      <Typography variant="h6" color="primary" sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {statData[mainstat].name}
      </Typography>
      <Divider />
      <Stack>
        {subStatList.map(({ subStatId, value }, index) => (
          <Row key={index} subStatId={subStatId} value={value} />
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
