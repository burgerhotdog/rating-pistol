import React from "react";
import { Link } from "react-router-dom";
import { Container, Stack, Button } from "@mui/material";
import GENSHIN_IMPACT from "../assets/banner/genshin-impact.webp"
import HONKAI_STAR_RAIL from "../assets/banner/honkai-star-rail.webp"
import WUTHERING_WAVES from "../assets/banner/wuthering-waves.webp"
import ZENLESS_ZONE_ZERO from "../assets/banner/zenless-zone-zero.webp"

const tint = "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))";

const Menu = () => {
  return (
    <Container maxWidth="sm">
      <Stack justifyContent="center" alignItems="center" mt={8} gap={2}>
        <Button
          className="menuButton"
          component={Link}
          to="/genshin-impact"
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${GENSHIN_IMPACT})` }}
        >
          Genshin Impact
        </Button>
        <Button
          className="menuButton"
          component={Link}
          to="/honkai-star-rail"
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${HONKAI_STAR_RAIL})` }}
        >
          Honkai Star Rail
        </Button>
        <Button
          className="menuButton"
          component={Link}
          to="/wuthering-waves"
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${WUTHERING_WAVES})` }}
        >
          Wuthering Waves
        </Button>
        <Button
          className="menuButton"
          component={Link}
          to="/zenless-zone-zero"
          fullWidth
          sx={{ backgroundImage: `${tint}, url(${ZENLESS_ZONE_ZERO})` }}
        >
          Zenless Zone Zero
        </Button>
      </Stack>
    </Container>
  );
};

export default Menu;
