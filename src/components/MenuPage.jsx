import React from "react";
import { Link } from "react-router-dom";
import { Container, Stack, Button } from "@mui/material";
import gi from "../assets/banner_gi.webp"
import hsr from "../assets/banner_hsr.webp"
import ww from "../assets/banner_ww.webp"
import zzz from "../assets/banner_zzz.webp"

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
    <Stack alignItems="center" mt={8} spacing={2}>
      {games.map(({ name, path, img }) => (
        <Button key={path} component={Link} to={path} sx={buttonStyles(img)}>
          {name}
        </Button>
      ))}
    </Stack>
  </Container>
);

export default MenuPage;
