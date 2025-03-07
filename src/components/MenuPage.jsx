import React from "react";
import { Link } from "react-router-dom";
import { Container, Stack, Button } from "@mui/material";
import gi from "../assets/gi/banner.webp"
import hsr from "../assets/hsr/banner.webp"
import ww from "../assets/ww/banner.webp"
import zzz from "../assets/zzz/banner.webp"

const tint = "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75))";

const MenuPage = () => {
  return (
    <Container maxWidth="sm">
      <Stack justifyContent="center" alignItems="center" mt={8} spacing={2}>
        <Button
          className="menuButton"
          component={Link}
          to="/genshin-impact"
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${gi})` }}
        >
          Genshin Impact
        </Button>
        <Button
          className="menuButton"
          component={Link}
          to="/honkai-star-rail"
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${hsr})` }}
        >
          Honkai Star Rail
        </Button>
        <Button
          className="menuButton"
          component={Link}
          to="/wuthering-waves"
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${ww})` }}
        >
          Wuthering Waves
        </Button>
        <Button
          className="menuButton"
          component={Link}
          to="/zenless-zone-zero"
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${zzz})` }}
        >
          Zenless Zone Zero
        </Button>
      </Stack>
    </Container>
  );
};

export default MenuPage;
