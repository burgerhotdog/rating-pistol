import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { ICON_ASSETS } from '@/assets';
import { VERSION } from '@/data';

const HeaderNav = () => {
  const { gameId } = useParams();
  const [isFanHovered, setIsFanHovered] = useState(false);

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
          visibility: 'visible',
          pointerEvents: 'auto',
        }}
      >
        {Object.keys(VERSION).map((id, index) => {
          const isActiveGame = gameId === id;
          return (
            <Link key={id} to={id}>
              <Box
                component="img"
                alt={id}
                src={ICON_ASSETS[id]}
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
