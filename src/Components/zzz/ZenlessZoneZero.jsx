import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Back from '../Back';

const ZenlessZoneZero = () => {
  return (
    <Container>
      <Back />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4,
      }}>
        <Typography variant='h3'>Zenless Zone Zero</Typography>
        <Typography variant="body2">Updated for version 1.4</Typography>
      </Box>
    </Container>
  );
};

export default ZenlessZoneZero;
