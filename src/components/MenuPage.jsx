import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Stack, Button, Typography } from "@mui/material";
import gi from "../assets/banner_gi.webp";
import hsr from "../assets/banner_hsr.webp";
import ww from "../assets/banner_ww.webp";
import zzz from "../assets/banner_zzz.webp";
import getImgs from "./getImgs";
import assets from "../assets";

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

const games = [
  { name: "Genshin Impact", path: "/genshin-impact", img: gi },
  { name: "Honkai Star Rail", path: "/honkai-star-rail", img: hsr },
  { name: "Wuthering Waves", path: "/wuthering-waves", img: ww },
  { name: "Zenless Zone Zero", path: "/zenless-zone-zero", img: zzz },
];

const MenuPage = () => (
  <Container>
    <Stack alignItems="center" mt={6} mb={2} spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h2" fontWeight="bold">Rating Pistol</Typography>
        <Box
          component="img"
          alt={"title"}
          src={assets[`./title.webp`]?.default}
          sx={{ width: 100, height: 100 }}
        />
      </Stack>
      {games.map(({ name, path, img }) => (
        <Button key={path} component={Link} to={path} sx={buttonStyles(img)}>
          {name}
        </Button>
      ))}
    </Stack>
  </Container>
);

export default MenuPage;
