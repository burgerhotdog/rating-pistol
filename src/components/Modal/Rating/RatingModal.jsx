import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
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
      <Typography>Currently redesigning this page please check back later</Typography>
    </Box>
  );
};

export default RatingModal;
