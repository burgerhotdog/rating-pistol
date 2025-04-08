import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Stack, Button, Typography } from "@mui/material";
import { MISC_ASSETS } from "@assets";
import { LABELS_DATA } from "@data/misc";

const buttonStyles = (img) => ({
  background: `rgba(0, 0, 0, 0.7) url(${img}) center/cover`,
  backgroundBlendMode: "overlay",
  width: 600,
  height: 80,
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "white",
  "&:hover": { opacity: 0.8 },
});

const games = ["gi", "hsr", "ww", "zzz"];

const Menu = () => (
  <Container>
    <Stack alignItems="center" mt={6} mb={2} spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h2" fontWeight="bold">Rating Pistol</Typography>
        <Box
          component="img"
          alt={"title"}
          src={MISC_ASSETS[`./icon.webp`]?.default}
          sx={{ width: 100, height: 100 }}
        />
      </Stack>
      {games.map((id) => (
        <Button
          key={id}
          component={Link}
          to={LABELS_DATA[id].path}
          sx={buttonStyles(MISC_ASSETS[`./banner/${id}.webp`]?.default)}
        >
          {LABELS_DATA[id].title}
        </Button>
      ))}
    </Stack>
  </Container>
);

export default Menu;
