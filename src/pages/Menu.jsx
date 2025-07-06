import { Link } from "react-router-dom";
import { Container, Stack, Box, Typography, Tooltip } from "@mui/material";
import { ICON_ASSETS } from "@assets";
import { INFO_DATA } from "@data";

const GameLink = ({ gameId }) => (
  <Tooltip title={INFO_DATA[gameId].TITLE}>
    <Link to={INFO_DATA[gameId].PATH}>
      <Box
        component="img"
        alt={gameId}
        src={ICON_ASSETS[gameId]}
        sx={{ 
          width: 160,
          height: 160,
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.1) rotate(-5deg)",
            transition: "all 0.2s ease-in-out",
          },
        }}
      />
    </Link>
  </Tooltip>
);

const Menu = () => (
  <Container
    maxWidth="md"
    sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      mb={4}
    >
      <Typography
        variant="h1"
        fontWeight="bold"
        sx={{ fontSize: { xs: "3rem", md: "6rem" } }}
      >
        Rating Pistol
      </Typography>
      <Box
        component="img"
        alt="icon"
        src={ICON_ASSETS.default}
        sx={{ width: { xs: 60, md: 120 }, height: "auto" }}
      />
    </Stack>

    <Stack
      display={{ xs: "none", md: "flex" }}
      direction="row"
      justifyContent="center"
      spacing={2}
      mb={6}
    >
      <GameLink gameId="gi" />
      <GameLink gameId="hsr" />
      <GameLink gameId="ww" />
      <GameLink gameId="zzz" />
    </Stack>

    <Stack display={{ xs: "flex", md: "none" }} spacing={2} mb={6}>
      <Stack direction="row" justifyContent="center" spacing={2}>
        <GameLink gameId="gi" />
        <GameLink gameId="hsr" />
      </Stack>
      <Stack direction="row" justifyContent="center" spacing={2}>
        <GameLink gameId="ww" />
        <GameLink gameId="zzz" />
      </Stack>
    </Stack>
  </Container>
);

export default Menu;
