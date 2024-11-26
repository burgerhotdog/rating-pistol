import React from 'react';
import { Box, Typography } from '@mui/material';
import BackToMenu from './BackToMenu';

const GI = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={{ textAlign: 'center' }}
    >
      <Typography variant="h4" gutterBottom>Genshin Impact</Typography>
      <BackToMenu />
    </Box>
  );
};

export default GI;
