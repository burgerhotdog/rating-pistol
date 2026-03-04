import { Link } from 'react-router-dom';
import { Container, Stack, Box, Typography, Tooltip } from '@mui/material';
import { ICON_ASSETS } from '@assets';
import { INFO_DATA } from '@data';

const GameLink = ({ gameId }) => (
  <Tooltip title={INFO_DATA[gameId].TITLE}>
    <Link to={INFO_DATA[gameId].PATH}>
      <Box
        component="img"
        alt={gameId}
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
