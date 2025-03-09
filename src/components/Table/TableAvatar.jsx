import React from "react";
import { Tooltip, Stack, Box, Typography } from "@mui/material";
import getData from "../getData";
import getIcons from "../getIcons";

const TableAvatar = ({
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
      item: "avatar",
      id,
      data,
    });
  };

  return (
    <Tooltip title={`Edit ${generalData.SECTIONS[0]}`} arrow>
      <Stack
        onClick={openModal}
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ cursor: "pointer", display: "inline-flex" }}
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
  );
};

export default TableAvatar;
