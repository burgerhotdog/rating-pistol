import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container } from '@mui/material';
import gi from '../assets/gi.webp'
import hsr from '../assets/hsr.webp'
import zzz from '../assets/zzz.webp'
import ww from '../assets/ww.webp'

const tint = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))';

const Menu = () => {
  return (
    <Container maxWidth='sm'>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        minHeight='100vh'
        sx={{ padding: 2 }}
      >
        {/* Genshin Impact */}
        <Button className='menuButton'
          component={Link}
          to='/genshin-impact'
          fullWidth
          sx={{
            backgroundImage: `${tint}, url(${gi})`,
            margin: 1,
          }}
        >
          Genshin Impact
        </Button>

        {/* Honkai Star Rail */}
        <Button className='menuButton'
          component={Link}
          to='/honkai-star-rail'
          fullWidth
          sx={{
            backgroundImage: `${tint}, url(${hsr})`,
            margin: 1,
          }}
        >
          Honkai Star Rail
        </Button>

        {/* Zenless Zone Zero */}
        <Button className='menuButton'
          component={Link}
          to='/zenless-zone-zero'
          fullWidth
          sx={{
            backgroundImage: `${tint}, url(${zzz})`,
            margin: 1,
          }}
        >
          Zenless Zone Zero
        </Button>

        {/* Wuthering Waves */}
        <Button className='menuButton'
          component={Link}
          to='/wuthering-waves'
          fullWidth
          sx={{
            backgroundImage: `${tint}, url(${ww})`,
            margin: 1,
          }}
        >
          Wuthering Waves
        </Button>
      </Box>
    </Container>
  );
};

export default Menu;
