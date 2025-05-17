import { useState } from "react";
import { Box, Stack, Typography, Tabs, Tab } from "@mui/material";
import { EQUIP_ASSETS } from "@assets";
import { INFO_DATA } from "@data";
import Info from "./Info";
import Plot from "./Plot";

const Rating = ({ gameId, modalPipe }) => {
  const { id, data, rating } = modalPipe;
  const [activeTab, setActiveTab] = useState(0);

  if (!rating) return (
    <Stack spacing={2}>
      <Typography>
        No rating data available.
      </Typography>
    </Stack>
  );

  return (
    <Stack spacing={2}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Full Build" sx={{ fontWeight: "bold" }} />
        {INFO_DATA[gameId].EQUIP_NAMES.map((name, index) => (
          <Tab
            key={index}
            label={(
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  component="img"
                  src={EQUIP_ASSETS[gameId][index]}
                  sx={{ width: 24, height: 24, objectFit: "contain" }}
                />
                <Typography variant="body2">
                  {name}
                </Typography>
              </Stack>
            )}
          />
        ))}
      </Tabs>

      <Stack direction="row" spacing={2}>
        <Info
          gameId={gameId}
          avatarId={id}
          isFullBuild={activeTab === 0}
          ratingData={activeTab === 0
            ? rating.avatar
            : rating.equips[activeTab - 1]}
        />
        <Plot
          ratingData={activeTab === 0
            ? rating.avatar
            : rating.equips[activeTab - 1]}
        />
      </Stack>
    </Stack>
  );
};

export default Rating;
