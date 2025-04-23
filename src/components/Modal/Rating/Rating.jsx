import { useState } from "react";
import { Box, Stack, Typography, Tabs, Tab } from "@mui/material";
import { EQUIP_ASSETS } from "@assets";
import { AVATAR_DATA, INFO_DATA } from "@data";
import Histogram from "./Histogram";

const Rating = ({ gameId, modalPipe }) => {
  const { id, data, rating } = modalPipe;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Stack spacing={2} sx={{ width: 800 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Rating Analysis
      </Typography>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="fullWidth"
        centered
      >
        <Tab label="Total" sx={{ fontWeight: "bold" }} />
        {INFO_DATA[gameId].EQUIP_NAMES.map((name, index) => (
          <Tab
            key={index}
            label={(
              <Stack direction="row" alignItems="center">
                <Box
                  component="img"
                  src={EQUIP_ASSETS[gameId][index]}
                  sx={{ width: 24, height: 24, objectFit: "contain" }}
                />
                {name}
              </Stack>
            )}
          />
        ))}
      </Tabs>

      {activeTab === 0 ? (
        <Histogram
          percentile={rating.avatar.percentile}
          score={rating.avatar.score}
          simScores={rating.avatar.simScores}
        />
      ) : (
        <Histogram
          percentile={rating.equips[activeTab - 1].percentile}
          score={rating.equips[activeTab - 1].score}
          simScores={rating.equips[activeTab - 1].simScores}
        />
      )}
    </Stack>
  );
};

export default Rating;
