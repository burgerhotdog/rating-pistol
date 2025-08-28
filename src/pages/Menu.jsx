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

const Menu = () => (
  <Container maxWidth="md">
    <Stack display="flex" justifyContent="center" height="100vh" gap={3}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Typography
          variant="h1"
          fontWeight="bold"
          sx={{ fontSize: { xs: '3rem', md: '6rem' } }}
        >
          Rating Pistol
        </Typography>
        <Box
          component="img"
          alt="icon"
          src={ICON_ASSETS.default}
          sx={{ width: { xs: 60, md: 120 }, height: 'auto' }}
        />
      </Box>

      <Box
        display={{ xs: 'none', md: 'flex' }}
        justifyContent="center"
        gap={2}
      >
        <GameLink gameId="gi" />
        <GameLink gameId="hsr" />
        <GameLink gameId="ww" />
        <GameLink gameId="zzz" />
      </Box>

      <Stack display={{ xs: 'flex', md: 'none' }} gap={2}>
        <Box display="flex" justifyContent="center" gap={2}>
          <GameLink gameId="gi" />
          <GameLink gameId="hsr" />
        </Box>
        <Box display="flex" justifyContent="center" gap={2}>
          <GameLink gameId="ww" />
          <GameLink gameId="zzz" />
        </Box>
      </Stack>
    </Stack>
  </Container>
);

export default Menu;
