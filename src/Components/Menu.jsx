import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

const tint = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))';

const Menu = () => {
  return (
    <Container>
      <Box
        display='flex'
        flexDirection='column'
        gap={1.5}
      >
        <Typography variant='h3'>
          Gacha Manager
        </Typography>

        {/* Genshin Impact */}
        <Button className='menuButton'
          component={Link}
          to='/genshin-impact'
          fullWidth
          sx={{backgroundImage: `${tint}, url(/Gacha-Manager/gi.webp)`}}
        >
          Genshin Impact
        </Button>

        {/* Honkai Star Rail */}
        <Button className='menuButton'
          component={Link}
          to='/honkai-star-rail'
          fullWidth
          sx={{backgroundImage: `${tint}, url(/Gacha-Manager/hsr.webp)`}}
        >
          Honkai Star Rail
        </Button>

        {/* Zenless Zone Zero */}
        <Button className='menuButton'
          component={Link}
          to='/zenless-zone-zero'
          fullWidth
          sx={{backgroundImage: `${tint}, url(/Gacha-Manager/zzz.webp)`}}
        >
          Zenless Zone Zero
        </Button>

        {/* Wuthering Waves */}
        <Button className='menuButton'
          component={Link}
          to='/wuthering-waves'
          fullWidth
          sx={{backgroundImage: `${tint}, url(/Gacha-Manager/wuwa.webp)`}}
        >
          Wuthering Waves
        </Button>
      </Box>
    </Container>
  );
};

export default Menu;
