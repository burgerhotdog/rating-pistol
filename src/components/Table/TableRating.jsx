import React from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { ErrorOutline } from '@mui/icons-material';
import getData from "../getData";
import getLetter from "../getLetter";
import letterIcons from "../../assets/icons";

const TableRating = ({
  gameId,
  setAction,
  id,
  data,
  rating,
}) => {
  const { generalData } = getData(gameId);
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
      {rating.combined !== -1 ? (
        <Tooltip title="See Details" arrow>
          <Box
            onClick={openModal}
            component="img"
            alt={rating.final}
            src={letterIcons[`./${getLetter(rating.final)}.webp`]?.default}
            sx={{ width: 40, height: 40, objectFit: "contain", cursor: "pointer" }}
          />
        </Tooltip>
      ) : (
        <Tooltip
          title={
            <Stack>
              {rating?.parts.map((part, index) => part === -1
                ? <Typography key={index}>{`Missing ${generalData.SECTIONS[index]}`}</Typography>
                : null)}
            </Stack>
          }
          arrow
        >
          <ErrorOutline color="error" />
        </Tooltip>
      )}
    </Stack>
  );
};

export default TableRating;
