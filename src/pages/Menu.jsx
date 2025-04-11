import React from "react";
import { Link } from "react-router-dom";
import { Container, Stack, Box, Button, Typography } from "@mui/material";
import { ICON, BANNER_ASSETS } from "@assets/static";
import INFO from "@data/static/info";

const gameIds = ["gi", "hsr", "ww", "zzz"];

const styles = (src) => ({
  background: `rgba(0, 0, 0, 0.7) url(${src}) center/cover`,
  backgroundBlendMode: "overlay",
  width: 600,
  height: 80,
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "white",
  "&:hover": { opacity: 0.8 },
});

const Menu = () => (
  <Container>
    <Stack alignItems="center" mt={6} mb={2} spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h2" fontWeight="bold">Rating Pistol</Typography>
        <Box
          component="img"
          alt="icon"
          src={ICON}
          sx={{ width: 100, height: 100 }}
        />
      </Stack>

      {gameIds.map((gameId) => (
        <Button
          key={gameId}
          component={Link}
          to={INFO[gameId].PATH}
          sx={styles(BANNER_ASSETS[`./${gameId}.webp`]?.default)}
        >
          {INFO[gameId].TITLE}
        </Button>
      ))}
    </Stack>
  </Container>
);

export default Menu;
