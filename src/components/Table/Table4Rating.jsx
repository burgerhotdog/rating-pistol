import React, { useMemo } from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
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
  const { generalData } = getData[gameId];

  const openModal = () => {
    setModalPipe({
      type: "rating",
      id,
      data,
      rating,
    });
  };

  const missingSections = useMemo(() => (
    <Stack>
      {rating.parts.map((part, index) => 
        part === -1 ? (
          <Typography variant="tooltip" key={index}>
            {`Missing ${generalData.SECTIONS[index]}`}
          </Typography>
        ) : null
      )}
    </Stack>
  ), [rating.parts]);

  if (rating.combined === -1) {
    return (
      <Tooltip title={missingSections} arrow>
        <ErrorOutline color="error" />
      </Tooltip>
    );
  }

  const letter = useMemo(() => getLetter(rating.combined), [rating.combined]);
  const letterSrc = letterIcons[`./letter_${letter}.webp`]?.default;

  return (
    <Tooltip title="See Details" arrow>
      <Box
        component="img"
        onClick={openModal}
        src={letterSrc}
        alt={rating.final}
        sx={{ width: 40, height: 40, objectFit: "contain" }}
      />
    </Tooltip>
  );
};

export default Table4Rating;
