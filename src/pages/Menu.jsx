import React from "react";
import { Link } from "react-router-dom";
import { Container, Stack, Box, Typography, Tooltip } from "@mui/material";
import { ICON_ASSETS } from "@assets";
import { INFO_DATA } from "@data";

const gameIds = ["gi", "hsr", "ww", "zzz"];

const updates = [
  {
    date: "2025.04.29",
    title: "Wuthering Waves Version 2.3",
    topics: [
      "New Resonators: Zani, Ciaconna",
      "New Weapons: Blazing Justice, Woodland Aria",
    ],
  },
];

const Menu = () => (
  <Container sx={{ minHeight: "100vh", display: "flex", alignItems: "center", py: 4 }}>
    <Stack alignItems="center" spacing={8} sx={{ width: "100%" }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h1" fontWeight="bold">
            Rating Pistol
          </Typography>
          <Box
            component="img"
            alt="icon"
            src={ICON_ASSETS.default}
            sx={{ 
              width: 120,
              height: 120,
              filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))",
            }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          {gameIds.map((gameId) => (
            <Link key={gameId} to={INFO_DATA[gameId].PATH} style={{ textDecoration: "none" }}>
              <Tooltip 
                title={INFO_DATA[gameId].TITLE}
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
                  src={ICON_ASSETS[gameId]}
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

      <Stack spacing={2} width={800}>
        <Typography variant="h5" fontWeight="bold">
          {`Announcements`}
        </Typography>
        <Stack spacing={1.5} maxHeight={200} overflow="auto">
          {updates.map(({ date, title, topics }, index) => (
            <Box key={index}>
              <Typography variant="subtitle1">
                {date} - {title}
              </Typography>
              <Stack spacing={0.5}>
                {topics.map((topic, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    color="text.secondary"
                  >
                    {topic}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Stack>
  </Container>
);

export default Menu;
