import { useState } from "react";
import { Box, Stack, Typography, Tabs, Tab } from "@mui/material";
import { EQUIP_ASSETS } from "@assets";
import { AVATAR_DATA, INFO_DATA } from "@data";
import Frequency from "./Frequency";
import Percentile from "./Percentile";

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
        variant="fullWidth"
        centered
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Total" sx={{ fontWeight: "bold" }} />
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
                <Typography>{name}</Typography>
              </Stack>
            )}
          />
        ))}
      </Tabs>

      {activeTab === 0 ? (
        <Stack direction="row" spacing={2}>
          <Frequency
            gameId={gameId}
            avatarId={id}
            score={rating.avatar.score}
            simScores={rating.avatar.simScores}
          />
          <Percentile
            gameId={gameId}
            avatarId={id}
            score={rating.avatar.score}
            simScores={rating.avatar.simScores}
          />
        </Stack>
      ) : (
        <Stack direction="row" spacing={2}>
          <Frequency
            gameId={gameId}
            avatarId={id}
            score={rating.equips[activeTab - 1].score}
            simScores={rating.equips[activeTab - 1].simScores}
          />
          <Percentile
            gameId={gameId}
            avatarId={id}
            score={rating.equips[activeTab - 1].score}
            simScores={rating.equips[activeTab - 1].simScores}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default Rating;
