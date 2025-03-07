import React from "react";
import { Stack, Tooltip, Typography } from "@mui/material";
import { ErrorOutline } from '@mui/icons-material';

const TableRating = ({
  setAction,
  id,
  data,
  rating,
}) => {
  const openModal = () => {
    setAction({
      type: "rating",
      id,
      data,
      rating,
    });
  };

  return (
    <Stack alignItems="center">
      <Tooltip title="See Details" arrow>
        {rating.final !== -1 ? (
          <Typography onClick={openModal} sx={{ cursor: "pointer" }}>
            {rating.final.toString()}
          </Typography>
        ) : (
          <ErrorOutline color="error" cursor="pointer" />
        )}
      </Tooltip>
    </Stack>
  );
};

export default TableRating;
