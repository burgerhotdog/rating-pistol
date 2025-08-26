import { Stack, Box, Typography } from '@mui/material';
import { EQUIP_ASSETS } from '@assets';

export default (gameId, name, index) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box
        component="img"
        src={EQUIP_ASSETS[gameId][index]}
        sx={{ width: 24, height: 24, objectFit: 'contain' }}
      />
      <Typography variant="body2">
        {name}
      </Typography>
    </Stack>
  );
};
