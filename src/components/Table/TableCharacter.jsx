import React from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import getData from "../getData";
import getIcons from "../getIcons";

const TableCharacter = ({
  gameId,
  setAction,
  id,
  data,
}) => {
  const { generalData, avatarData } = getData(gameId);
  const { avatarIcons } = getIcons(gameId);
  
  const openModal = () => {
    setAction({
      type: "edit",
      item: "character",
      id,
      data,
    });
  };

  const addOrEdit = "Edit";
  const sectionName = generalData.SECTION_NAMES[0];

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
            src={avatarIcons[`./${id}.webp`]?.default}
            sx={{ width: 50, height: 50, objectFit: "contain" }}
          />
          <Typography variant="body2" sx={{ textAlign: "left" }}>
            {avatarData[id].name}
          </Typography>
        </Stack>
      </Tooltip>
    </Stack>
  );
};

export default TableCharacter;
