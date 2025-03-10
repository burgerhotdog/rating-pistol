import React from "react";
import { Stack, Typography } from "@mui/material";
import getData from "../../getData";

const RatingModal = ({ gameId, action }) => {
  const { generalData } = getData[gameId];

  return (
    <Stack spacing={2}>
      <Typography variant="body1">
        Score Breakdown
      </Typography>
      {generalData.SECTIONS.map((section, index) => (
        <Typography key={index} variant="body2">
          {`${section} Score: ${Math.round(action.rating.parts[index])}`}
        </Typography>
      ))}
    </Stack>
  );
};

export default RatingModal;
