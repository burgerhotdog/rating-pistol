import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

const Rating = ({ gameId, pipe }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTab = (_, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: 500 }}>
      <Typography>This page is currently being redesigned. Please check back later</Typography>
    </Box>
  );
};

export default Rating;
