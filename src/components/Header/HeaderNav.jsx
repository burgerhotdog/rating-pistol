import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stack, Box, Typography } from '@mui/material';
import { ICON_ASSETS } from '@/assets';

const GAME_IDS = [
  'genshin-impact',
  'honkai-star-rail',
  'wuthering-waves',
  'zenless-zone-zero',
];

const HeaderNav = ({ gamePath }) => {
  const [isFanHovered, setIsFanHovered] = useState(false);
  const isHomePage = gamePath === '';

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box
        component={Link}
        to="/"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'inherit',
          textDecoration: 'none',
          borderBottom: '1px solid transparent',
          '&:hover': {
            borderBottomColor: 'currentColor',
          }
        }}
      >
        <Box
          component="img"
          alt="icon"
          src={ICON_ASSETS.default}
          sx={{ width: 40 }}
        />
        <Typography variant="h5" fontWeight="bold">
          Rating Pistol
        </Typography>
      </Box>

      <Box 
        onMouseEnter={() => setIsFanHovered(true)}
        onMouseLeave={() => setIsFanHovered(false)}
        sx={{
          position: 'relative',
          width: 40,
          height: 40,
          visibility: isHomePage ? 'hidden' : 'visible',
          pointerEvents: isHomePage ? 'none' : 'auto',
        }}
      >
        {GAME_IDS.map((gameId, index) => {
          const isActiveGame = gamePath === gameId;
          return (
            <Link key={gameId} to={gameId}>
              <Box
                component="img"
                alt={gameId}
                src={ICON_ASSETS[gameId]}
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 40,
                  height: 40,
                  transform: isFanHovered
                    ? `translateX(${index * 40}px)`
                    : 'translateX(0)',
                  opacity: isFanHovered || isActiveGame ? 1 : 0,
                  zIndex: isActiveGame ? 5 : 4 - index,
                  transition: 'transform 0.25s ease-out, opacity 0.2s ease-out',
                }}
              />
            </Link>
          );
        })}
      </Box>
    </Stack>
  );
};

export default HeaderNav;
