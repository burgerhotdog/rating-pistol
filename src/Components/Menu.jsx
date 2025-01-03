import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container } from '@mui/material';

import gi from '../assets/gi/gi.webp'
import hsr from '../assets//hsr/hsr.webp'
import zzz from '../assets/zzz/zzz.webp'
import ww from '../assets/ww/ww.webp'

const tint = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))';

const Menu = () => {
  return (
    <Container maxWidth='sm'>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 8,
        gap: 2,
      }}>
        {/* Genshin Impact */}
        <Button className='menuButton'
          component={Link}
          to='/genshin-impact'
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${gi})` }}
        >
          Genshin Impact
        </Button>

        {/* Honkai Star Rail */}
        <Button className='menuButton'
          component={Link}
          to='/honkai-star-rail'
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${hsr})` }}
        >
          Honkai Star Rail
        </Button>

        {/* Zenless Zone Zero */}
        <Button className='menuButton'
          component={Link}
          to='/zenless-zone-zero'
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${zzz})` }}
        >
          Zenless Zone Zero
        </Button>

        {/* Wuthering Waves */}
        <Button className='menuButton'
          component={Link}
          to='/wuthering-waves'
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${ww})` }}
        >
          Wuthering Waves
        </Button>
      </Box>
    </Container>
  );
};

export default Menu;
