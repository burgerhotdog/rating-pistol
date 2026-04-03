import { Link } from 'react-router-dom';
import { Stack, Box, Tooltip } from '@mui/material';
import { ICON_ASSETS } from '@/assets';
import { STATS } from '@/data';

const GameLink = ({ gameId }) => {
  const { TITLE } = STATS[gameId];
  return (
    <Tooltip title={TITLE}>
      <Link to={`/${gameId}`}>
        <Box
          component="img"
          alt={TITLE}
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
      display={{ xs: 'none', md: 'flex' }}
      justifyContent="center"
      gap={2}
    >
      <GameLink gameId="genshin-impact" />
      <GameLink gameId="honkai-star-rail" />
      <GameLink gameId="wuthering-waves" />
      <GameLink gameId="zenless-zone-zero" />
    </Box>

    <Stack display={{ xs: 'flex', md: 'none' }} gap={2}>
      <Box display="flex" justifyContent="center" gap={2}>
        <GameLink gameId="genshin-impact" />
        <GameLink gameId="honkai-star-rail" />
      </Box>
      <Box display="flex" justifyContent="center" gap={2}>
        <GameLink gameId="wuthering-waves" />
        <GameLink gameId="zenless-zone-zero" />
      </Box>
    </Stack>
  </>
);

export default HomePage;
