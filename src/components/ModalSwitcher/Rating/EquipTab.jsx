import React from "react";
import {
  Stack,
  Typography
} from "@mui/material";

const EquipTab = ({ modalPipe }) => {
  return (
    <Stack mt={2}>
      <Typography variant="body2">
        {`Equip: ${Math.round(modalPipe.rating.parts[2])}% complete`}
      </Typography>
    </Stack>
  );
};

export default EquipTab;
