import React from "react";
import { Stack, Typography } from "@mui/material";

const EquipTab = ({ pipe }) => {
  return (
    <Stack mt={2}>
      <Typography variant="body2">
        {`Equip: ${Math.round(pipe.rating.parts[2])}% complete`}
      </Typography>
    </Stack>
  );
};

export default EquipTab;
