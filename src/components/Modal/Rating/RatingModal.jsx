import React from "react";
import { Stack, Typography } from "@mui/material";
import getData from "../../getData";

const RatingModal = ({ gameId, modalPipe }) => {
  const { SECTIONS } = getData[gameId].generalData;

  return (
    <Stack spacing={2}>
      <Typography variant="body1">
        Rating Breakdown
      </Typography>
      
      <Typography variant="body2">
        {`Levels: ${Math.round(modalPipe.rating.parts[0])}`}
      </Typography>

      <Typography variant="body2">
        {`${SECTIONS[3]}: ${Math.round(modalPipe.rating.parts[1])}`}
      </Typography>

      <Typography variant="body2">
        {`${SECTIONS[2]}: ${Math.round(modalPipe.rating.parts[2])}`}
      </Typography>
    </Stack>
  );
};

export default RatingModal;
