import React from "react";
import { Badge, Avatar, Stack, Tooltip } from "@mui/material";
import letterIcons from "../../assets";

const Table4Rating = ({
  setModalPipe,
  id,
  data,
  rating,
}) => {
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
            src={letterIcons[`./${rating.letter}.webp`]?.default}
            sx={{ width: 32, height: 32 }}
          />
        </Badge>
      </Stack>
    </Tooltip>
  );
};

export default Table4Rating;
