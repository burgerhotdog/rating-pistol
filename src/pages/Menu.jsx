import React from "react";
import { Link } from "react-router-dom";
import { Container, Stack, Box, Typography, Tooltip } from "@mui/material";
import { ICON_ASSETS } from "@assets";
import { INFO_DATA } from "@data";

const gameIds = ["gi", "hsr", "ww", "zzz"];

const updates = [
  {
    date: "2025.04.21",
    title: "OCR Data Imports & Revised Substat Weights",
    topics: [
      "Working on enabling data imports for Wuthering Waves echo mainstats and substats via uploading character cards created through the official Wuthering Waves Discord bot. More information can be found here: https://wutheringwaves.kurogames.com/en/main/news/detail/1959.",
      "Substats have been reweighted across all games to for better scoring accuracy. Scoring algorithms will be displayed in the rating tabs once they are completed."
    ],
  },
  {
    date: "2025.04.17",
    title: "Enhanced Rating Simulations & Performance Optimizations",
    topics: [
      "Similar to the artifact rating system, the new character rating system now generates a dataset of 10,000 unique builds. For each build, artifacts are randomly generated based on rarity: rare pieces (Elemental DMG pieces) are only generated once per build, while common pieces (Fixed mainstat pieces) are generated multiple times with only the best scoring piece used in the each final build. This simulates players farming domains and only keeping their best rolled pieces, creating a more realistic data spread for more accurate percentile calculations. The number of retry attempts for each artifact is determined at the beginning of each build, classifying it as F2P, dolphin, or whale levels of investment. This creates a distribution where lower percentiles may show a wider data spread, while higher percentiles (representing dedicated players who farm extensively) may have a more tightly packed data spread due to builds approaching the maximum possible score. After generating the complete dataset, each build is scored using character-specific substat weights, including the player's build. Finally, the player's build score is ranked against the artificial score distribution to get a close approximation of where a player's build stands when compared with others.",
      "Rating recalculations now only trigger after artifact updates, significantly improving overall site performance and decreasing load times.",
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

      <Box sx={{ 
        width: "100%", 
        maxWidth: 800, 
        p: 3, 
        borderRadius: 2,
        maxHeight: 200,
        overflow: "auto",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)"
      }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {`Latest Updates`}
        </Typography>
        <Stack mt={1} spacing={1.5}>
          {updates.map(({ date, title, topics }, index) => (
            <Box key={index}>
              <Typography variant="subtitle1" fontWeight="medium">
                {date} - {title}
              </Typography>
              <Stack spacing={1}>
                {topics.map((topic, index) => (
                  <Typography key={index} variant="body2" color="text.secondary">
                    {topic}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  </Container>
);

export default Menu;
