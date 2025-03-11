import React from "react";
import { Avatar, Badge, Tooltip, Stack, Box, Typography } from "@mui/material";
import getData from "../getData";
import getIcons from "../getIcons";

const Table1Avatar = ({
  gameId,
  setModalPipe,
  id,
  data,
}) => {
  const { generalData, avatarData } = getData[gameId];
  const { avatarIcons } = getIcons[gameId];
  
  const openModal = () => {
    setModalPipe({
      type: "avatar",
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
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={`${generalData.RANK_PREFIX}${data.rank}`}
        >
          <Avatar
            variant="square"
            alt={avatarData[id].name}
            src={avatarIcons[`./${id}.webp`]?.default}
          />
        </Badge>
        
        <Typography variant="body2" sx={{ textAlign: "left" }}>
          {avatarData[id].name}
        </Typography>
      </Stack>
    </Tooltip>
  );
};

export default Table1Avatar;
