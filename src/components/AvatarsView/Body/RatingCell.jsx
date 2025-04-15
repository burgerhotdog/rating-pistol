import React from "react";
import { Stack, Badge, Avatar, Typography, Tooltip, TableCell } from "@mui/material";
import RATING_ASSETS from "@assets/static/rating";


const getIconSrc = (rating) => {
  if (rating <= 10) return "0";
  if (rating <= 25) return "1";
  if (rating <= 50) return "2";
  return "3";
};

const RatingCell = ({ setPipe, id, data, rating, rawRating }) => {
  const openModal = () => setPipe({ type: "rating", id, data, rating, rawRating });
  const roundedRating = Math.ceil(rating);

  return (
    <TableCell align="center">
      <Tooltip title="See Details" arrow>
        <Stack direction="row" display="inline-flex" alignItems="center" gap={1}>
          <Badge onClick={openModal} sx={{ cursor: 'pointer' }}>
            <Avatar
              alt={String(rating)}
              src={RATING_ASSETS[`./${getIconSrc(rating)}.webp`]?.default}
              sx={{ width: 32, height: 32 }}
            />
          </Badge>
          <Typography
            onClick={openModal}
            sx={{ cursor: "pointer" }}
          >
            {`Top ${roundedRating}%`}
          </Typography>
        </Stack>
      </Tooltip>
    </TableCell>
  );
};

export default RatingCell;
