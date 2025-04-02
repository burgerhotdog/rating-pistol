import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { DATA } from "../../importData";
import LevelTab from "./LevelTab";
import SkillTab from "./SkillTab";
import EquipTab from "./EquipTab";

const RatingModal = ({ gameId, pipe }) => {
  const { HEADERS } = DATA[gameId];
  const [tabValue, setTabValue] = useState(0);

  const handleTab = (_, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: 500 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTab} centered>
          <Tab label={`${HEADERS.avatar} & ${HEADERS.weapon}`} />
          <Tab label={HEADERS.skills} />
          <Tab label={HEADERS.equips} />
        </Tabs>
      </Box>

      <Box hidden={tabValue !== 0}>
        <LevelTab pipe={pipe} />
      </Box>

      <Box hidden={tabValue !== 1}>
        <SkillTab pipe={pipe} />
      </Box>

      <Box hidden={tabValue !== 2}>
        <EquipTab pipe={pipe} />
      </Box>
    </Box>
  );
};

export default RatingModal;
