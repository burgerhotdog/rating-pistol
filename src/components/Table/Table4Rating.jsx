import React from "react";
import { Badge, Avatar, Stack, Tooltip } from "@mui/material";
import RATING_ASSETS from "@assets/static/rating";

const getIconSrc = (rating) => {
  if (rating >= 100) return "0";
  if (rating >= 90) return "1";
  if (rating >= 80) return "2";
  return "3";
};

const Table4Rating = ({ setPipe, id, data, rating }) => {
  const openModal = () => setPipe({ type: "rating", id, data, rating });

  return (
    <Tooltip title="See Details" arrow>
      <Stack display="inline-flex">
        <Badge onClick={openModal}>
          <Avatar
            alt={String(rating)}
            src={RATING_ASSETS[`./${getIconSrc(rating)}.webp`]?.default}
            sx={{ width: 32, height: 32 }}
          />
        </Badge>
      </Stack>
    </Tooltip>
  );
};

export default Table4Rating;
