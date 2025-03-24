import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import getData from "../../getData";
import LevelTab from "./LevelTab";
import SkillTab from "./SkillTab";
import EquipTab from "./EquipTab";

const RatingModal = ({ gameId, modalPipe }) => {
  const { HEADERS } = getData[gameId];
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
        <LevelTab modalPipe={modalPipe} />
      </Box>

      <Box hidden={tabValue !== 1}>
        <SkillTab modalPipe={modalPipe} />
      </Box>

      <Box hidden={tabValue !== 2}>
        <EquipTab modalPipe={modalPipe} />
      </Box>
    </Box>
  );
};

export default RatingModal;
