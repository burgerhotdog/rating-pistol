import { Link } from 'react-router-dom';
import { Stack, Box, Tooltip } from '@mui/material';
import { ICON_ASSETS } from '@/assets';
import { GI, HSR, WW, ZZZ } from '@/data';

const formatId = gameId => gameId
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

const GameLink = ({ gameId }) => {
  const title = formatId(gameId);

  return (
    <Tooltip title={title}>
      <Link to={`/${gameId}`}>
        <Box
          component="img"
          alt={title}
          src={ICON_ASSETS[gameId]}
          width={160}
          height={160}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.1) rotate(-5deg)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
        />
      </Link>
    </Tooltip>
  );
};

const HomePage = () => (
  <>
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <GameLink gameId={GI} />
      <GameLink gameId={HSR} />
      <GameLink gameId={WW} />
      <GameLink gameId={ZZZ} />
    </Box>

    <Stack
      sx={{
        display: { xs: 'flex', md: 'none' },
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <GameLink gameId={GI} />
        <GameLink gameId={HSR} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <GameLink gameId={WW} />
        <GameLink gameId={ZZZ} />
      </Box>
    </Stack>
  </>
);

export default HomePage;
