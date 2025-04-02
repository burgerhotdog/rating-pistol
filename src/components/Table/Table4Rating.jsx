import React from "react";
import { Badge, Avatar, Stack, Tooltip } from "@mui/material";
import { ASSETS } from "../importData";

const Table4Rating = ({ setPipe, id, data, rating }) => {
  const openModal = () => setPipe({ type: "rating", id, data, rating });

  return (
    <Tooltip title="See Details" arrow>
      <Stack display="inline-flex">
        <Badge onClick={openModal}>
          <Avatar
            alt={rating.final}
            src={ASSETS.other[`./${rating.letter}.webp`]?.default}
            sx={{ width: 32, height: 32 }}
          />
        </Badge>
      </Stack>
    </Tooltip>
  );
};

export default Table4Rating;
