import React from "react";
import { Link } from "react-router-dom";
import { Container, Stack, Box, Typography, Tooltip } from "@mui/material";
import { AVATAR_ASSETS, WEAPON_ASSETS, SET_ASSETS, ICON_ASSETS } from "@assets";
import { INFO_DATA } from "@data";

// Updates
const DATE = "May 21, 2025";
const TITLE = "Honkai Star Rail Version 3.3";
const UPDATES = [
  <span>
    New Characters:{" "}
    <Box component="img" src={AVATAR_ASSETS.hsr["1409"].icon} sx={{ display: "inline", width: 16, height: 16, verticalAlign: "text-bottom" }} />
    {" "}Hyacine,{" "}
    <Box component="img" src={AVATAR_ASSETS.hsr["1406"].icon} sx={{ display: "inline", width: 16, height: 16, verticalAlign: "text-bottom" }} />
    {" "}Cipher
  </span>,
  <span>
    New Weapons:{" "}
    <Box component="img" src={WEAPON_ASSETS.hsr["23042"]} sx={{ display: "inline", width: 16, height: 16, verticalAlign: "text-bottom" }} />
    {" "}Long May Rainbows Adorn the Sky,{" "}
    <Box component="img" src={WEAPON_ASSETS.hsr["23043"]} sx={{ display: "inline", width: 16, height: 16, verticalAlign: "text-bottom" }} />
    {" "}Lies Dance on the Breeze
  </span>,
  <span>
    New Relics:{" "}
    <Box component="img" src={SET_ASSETS.hsr["125"]["0"]} sx={{ display: "inline", width: 16, height: 16, verticalAlign: "text-bottom" }} />
    {" "}Warrior Goddess of Sun and Thunder,{" "}
    <Box component="img" src={SET_ASSETS.hsr["126"]["0"]} sx={{ display: "inline", width: 16, height: 16, verticalAlign: "text-bottom" }} />
    {" "}Wavestrider Captain
  </span>,
];

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

    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Updates: {DATE}
      </Typography>
      <Typography variant="subtitle1">
        {TITLE}
      </Typography>
      <Stack>
        {UPDATES.map((topic, index) => (
          <Typography key={index} variant="body2" color="text.secondary">
            {topic}
          </Typography>
        ))}
      </Stack>
    </Box>
  </Container>
);

export default Menu;
