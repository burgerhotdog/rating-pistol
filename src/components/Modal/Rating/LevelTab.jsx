import React from "react";
import { Stack, Typography } from "@mui/material";

const LevelTab = ({ pipe }) => {
  return (
    <Stack mt={2}>
      <Typography variant="body2">
        {`Character/Weapon Levels: ${Math.round(pipe.rating.parts[0])}% complete`}
      </Typography>
    </Stack>
  );
};

export default LevelTab;
