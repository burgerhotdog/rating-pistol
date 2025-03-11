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
  const { generalData } = getData[gameId];

  const letter = useMemo(() => getLetter(rating.combined), [rating.combined]);
  const letterSrc = letterIcons[`./letter_${letter}.webp`]?.default;

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

  return (
    <Tooltip title="See Details" arrow>
      <Badge>
        <Avatar
          onClick={openModal}
          alt={rating.final}
          src={letterSrc}
          sx={{ cursor: "pointer" }}
        />
      </Badge>
    </Tooltip>
  );
};

export default Table4Rating;
