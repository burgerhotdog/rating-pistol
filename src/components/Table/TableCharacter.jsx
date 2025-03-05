import React from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";

const TableCharacter = ({
  gameType,
  gameData,
  charIcons,
  setAction,
  id,
  data,
}) => {
  const { INFO, CHAR } = gameData;
  const openModal = () => {
    setAction({
      type: "edit",
      item: "character",
      id,
      data,
    });
  };

  const addOrEdit = "Edit";
  const sectionName = INFO.SECTION_NAMES[0];

  return (
    <Stack>
      <Tooltip title={`${addOrEdit} ${sectionName}`} arrow>
        <Stack
          onClick={openModal}
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ cursor: "pointer" }}
        >
          <Box
            component="img"
            alt={id}
            src={charIcons[`../assets/char/${gameType}/${id}.webp`]?.default}
            sx={{ width: 50, height: 50, objectFit: "contain" }}
          />
          <Typography variant="body2" sx={{ textAlign: "left" }}>
            {CHAR[id].name}
          </Typography>
        </Stack>
      </Tooltip>
    </Stack>
  );
};

export default TableCharacter;
