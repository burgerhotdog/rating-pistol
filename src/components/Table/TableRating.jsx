import React from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { ErrorOutline } from '@mui/icons-material';
import getLetter from "../getLetter";
import letterIcons from "../../assets/icons";

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
          <Box
            onClick={openModal}
            component="img"
            alt={rating.final}
            src={letterIcons[`./${getLetter(rating.final)}.webp`]?.default}
            sx={{ width: 40, height: 40, objectFit: "contain", cursor: "pointer" }}
          />
        ) : (
          <ErrorOutline color="error" cursor="pointer" />
        )}
      </Tooltip>
    </Stack>
  );
};

export default TableRating;
