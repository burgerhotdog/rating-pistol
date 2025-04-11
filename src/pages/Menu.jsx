import React from "react";
import { Link } from "react-router-dom";
import { Container, Stack, Box, Typography, Tooltip } from "@mui/material";
import { ICON, MENU_ASSETS } from "@assets/static";
import INFO from "@data/static/info";

const gameIds = ["gi", "hsr", "ww", "zzz"];

const Menu = () => (
  <Container sx={{ 
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    py: 4,
  }}>
    <Stack alignItems="center" spacing={2} sx={{ width: '100%' }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h1" fontWeight="bold">
          Rating Pistol
        </Typography>
        <Box
          component="img"
          alt="icon"
          src={ICON}
          sx={{ 
            width: 120,
            height: 120,
            filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))",
          }}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        {gameIds.map((gameId) => (
          <Link key={gameId} to={INFO[gameId].PATH} style={{ textDecoration: "none" }}>
            <Tooltip 
              title={INFO[gameId].TITLE}
              placement="bottom"
              slotProps={{
                tooltip: {
                  sx: {
                    backdropFilter: "blur(4px)",
                    fontSize: "1rem",
                    padding: "8px 16px",
                    borderRadius: "8px",
                  }
                }
              }}
            >
              <Box
                component="img"
                alt={gameId}
                src={MENU_ASSETS[`./${gameId}.png`]?.default}
                sx={{ 
                  width: 160,
                  height: 160,
                  cursor: "pointer",
                  filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.2))",
                  "&:hover": {
                    transform: "scale(1.1) rotate(-5deg)",
                    transition: "all 0.2s ease-in-out",
                    filter: "drop-shadow(0px 6px 12px rgba(0,0,0,0.3))"
                  }
                }}
              />
            </Tooltip>
          </Link>
        ))}
      </Stack>
    </Stack>
  </Container>
);

export default Menu;
