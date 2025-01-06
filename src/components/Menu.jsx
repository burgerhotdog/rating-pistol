import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container } from '@mui/material';
import GENSHIN_IMPACT from '../assets/genshin-impact.webp'
import HONKAI_STAR_RAIL from '../assets/honkai-star-rail.webp'
import ZENLESS_ZONE_ZERO from '../assets/zenless-zone-zero.webp'
import WUTHERING_WAVES from '../assets/wuthering-waves.webp'

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
          sx={{ backgroundImage: `${tint}, url(${GENSHIN_IMPACT})` }}
        >
          Genshin Impact
        </Button>

        {/* Honkai Star Rail */}
        <Button className='menuButton'
          component={Link}
          to='/honkai-star-rail'
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${HONKAI_STAR_RAIL})` }}
        >
          Honkai Star Rail
        </Button>

        {/* Zenless Zone Zero */}
        <Button className='menuButton'
          component={Link}
          to='/zenless-zone-zero'
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${ZENLESS_ZONE_ZERO})` }}
        >
          Zenless Zone Zero
        </Button>

        {/* Wuthering Waves */}
        <Button className='menuButton'
          component={Link}
          to='/wuthering-waves'
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${WUTHERING_WAVES})` }}
        >
          Wuthering Waves
        </Button>
      </Box>
    </Container>
  );
};

export default Menu;
