import React, { useMemo } from "react";
import { Badge, Avatar, Box, Stack, Tooltip, Typography } from "@mui/material";
import { ErrorOutline } from '@mui/icons-material';
import getData from "../getData";
import getLetter from "../getLetter";
import letterIcons from "../../assets/icons";

const Table4Rating = ({
  gameId,
  setModalPipe,
  id,
  data,
  rating,
}) => {
  const letterSrc = letterIcons[`./letter_${getLetter(rating.combined)}.webp`]?.default;

  const openModal = () => {
    setModalPipe({
      type: "rating",
      id,
      data,
      rating,
    });
  };

  return (
    <Tooltip title="See Details" arrow>
      <Stack display="inline-flex">
        <Badge onClick={openModal}>
          <Avatar
            alt={rating.final}
            src={letterSrc}
            sx={{ width: 32, height: 32 }}
          />
        </Badge>
      </Stack>
    </Tooltip>
  );
};

export default Table4Rating;
