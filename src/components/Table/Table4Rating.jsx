import React, { useMemo } from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { ErrorOutline } from '@mui/icons-material';
import getData from "../getData";
import getLetter from "../getLetter";
import letterIcons from "../../assets/icons";

const Table4Rating = ({
  gameId,
  setAction,
  id,
  data,
  rating,
}) => {
  const { generalData } = getData[gameId];

  const letter = useMemo(() => {
    return rating.combined !== -1
      ? getLetter(rating.combined)
      : null;
  }, [rating.combined]);
  const imageSrc = letter ? letterIcons[`./${letter}.webp`]?.default : null;

  const openModal = () => {
    setAction({
      type: "rating",
      id,
      data,
      rating,
    });
  };

  return (
    rating.combined !== -1 ? (
      <Tooltip title="See Details" arrow>
        <Box
          onClick={openModal}
          component="img"
          alt={rating.final}
          src={imageSrc}
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
    )
  );
};

export default Table4Rating;
