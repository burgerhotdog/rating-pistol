import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import BackToMenu from '../BackToMenu';

const WutheringWaves = () => {
  return (
    <Container maxWidth="sm">
      <Box
        component="header"
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ margin: 2 }}
      >
        <Typography variant="h4">Wuthering Waves</Typography>
        <BackToMenu />
      </Box>
      <Box
        component="body"
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ margin: 2 }}
      >
        <Typography variant="body1">
          Coming soon
        </Typography>
      </Box>
    </Container>
  );
};

export default WutheringWaves;
