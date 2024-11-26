import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';

const Menu = () => {
  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        sx={{ width: '100%' }}
      >
        <Typography variant="h4" gutterBottom>
          Main Menu
        </Typography>

        <Button component={Link} to="/gi" variant="contained" color="primary" fullWidth>
          Genshin Impact
        </Button>
        <Button component={Link} to="/hsr" variant="contained" color="primary" fullWidth>
          Honkai Star Rail
        </Button>
        <Button component={Link} to="/zzz" variant="contained" color="primary" fullWidth>
          Zenless Zone Zero
        </Button>
        <Button component={Link} to="/wuwa" variant="contained" color="primary" fullWidth>
          Wuthering Waves
        </Button>
      </Box>
    </Container>
  );
};

export default Menu;
