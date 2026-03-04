import { useState, useEffect, useContext } from 'react';
import { Stack, Box, Button, Typography, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { ICON_ASSETS } from '@assets';
import { INFO_DATA } from '@data';
import { AuthContext } from '@contexts';
import { useLocation } from 'react-router-dom';

const GAME_IDS = [
  'genshin-impact',
  'honkai-star-rail',
  'wuthering-waves',
  'zenless-zone-zero',
];

export default () => {
  const { user, handleAuth, isLoading } = useContext(AuthContext);
  const location = useLocation();
  const currentGame = location.pathname.slice(1);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            color: 'inherit',
            borderBottom: '1px solid transparent',
            '&:hover': { borderBottomColor: 'currentColor' }
          }}
        >
          <Box
            component="img"
            alt="icon"
            src={ICON_ASSETS.default}
            sx={{ width: 40, height: 'auto' }}
          />
          <Typography variant="h6" fontWeight="bold">
            Rating Pistol
          </Typography>
        </Box>

        <Box sx={{
          position: 'relative', height: 40, width: 40,
          visibility: currentGame === "" ? 'hidden' : 'visible',
          pointerEvents: currentGame === "" ? 'none' : 'auto',
          '&:hover .fan-icon': {
            transform: 'translateX(var(--spread))',
            opacity: 1,
          },
        }}>
          {GAME_IDS.map((gameId, index) => (
            <Link key={index} to={gameId}>
              <Box
                className="fan-icon"
                component="img"
                alt={gameId}
                src={ICON_ASSETS[gameId]}
                width={40}
                height={40}
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  transition: 'transform 0.25s ease, opacity 0.2s ease',
                  '--spread': `${index * 40}px`,
                  zIndex: currentGame === gameId ? 10 : 4 - index,
                  opacity: currentGame === gameId ? 1 : 0,
                  cursor: 'pointer',
                }}
              />
            </Link>
          ))}
        </Box>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        {user && (
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        )}

        <Box sx={{
          borderBottom: '1px solid transparent',
          '&:hover': {
            borderBottomColor: 'currentColor',
          },
        }}>
          <Button
            onClick={handleAuth}
            variant="text"
            sx={{
              textTransform: 'none',
              textDecoration: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {user ? "Sign Out" : "Sign In"}
            </Typography>
          </Button>
        </Box>
      </Stack>
    </Box>
  )
};
