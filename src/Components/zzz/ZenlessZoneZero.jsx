import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import BackToMenu from '../BackToMenu';

const ZenlessZoneZero = () => {
  return (
    <Container maxWidth="sm">
      <Box
        component="header"
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ marginTop: 4 }}
      >
        <Typography variant="h4">Zenless Zone Zero</Typography>
        <BackToMenu />
      </Box>
      <Box
        component="body"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant='body1' sx={{ marginTop: 2 }}>
          Coming soon
        </Typography>
      </Box>
    </Container>
  );
};

export default ZenlessZoneZero;
