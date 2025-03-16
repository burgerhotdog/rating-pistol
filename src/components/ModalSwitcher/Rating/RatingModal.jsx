import React from "react";
import { Stack, Typography } from "@mui/material";

const RatingModal = ({ gameId, modalPipe }) => {

  return (
    <Stack spacing={2}>
      <Typography variant="body1">
        Rating Breakdown (WIP)
      </Typography>
      
      <Typography variant="body2">
        {`Character/Weapon Levels: ${Math.round(modalPipe.rating.parts[0])}% complete`}
      </Typography>

      <Typography variant="body2">
        {`Skills: ${Math.round(modalPipe.rating.parts[1])}% complete`}
      </Typography>

      <Typography variant="body2">
        {`Equip: ${Math.round(modalPipe.rating.parts[2])}% complete`}
      </Typography>
    </Stack>
  );
};

export default RatingModal;
