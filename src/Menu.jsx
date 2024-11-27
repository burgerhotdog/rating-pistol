import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';

const Menu = () => {
  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        sx={{ width: '100%' }}
      >
        <Typography variant="h2" gutterBottom>
          Gacha Manager
        </Typography>

        <Button component={Link} to="/gi" variant="contained" fullWidth>
          Genshin Impact
        </Button>
        <Button component={Link} to="/hsr" variant="contained" fullWidth>
          Honkai Star Rail
        </Button>
        <Button component={Link} to="/zzz" variant="contained" fullWidth>
          Zenless Zone Zero
        </Button>
        <Button component={Link} to="/wuwa" variant="contained" fullWidth>
          Wuthering Waves
        </Button>
      </Box>
    </Container>
  );
};

export default Menu;
