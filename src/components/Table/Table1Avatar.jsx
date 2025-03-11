import React from "react";
import { Avatar, Badge, Tooltip, Stack, Typography } from "@mui/material";
import getData from "../getData";
import getIcons from "../getIcons";

const Table1Avatar = ({
  gameId,
  setModalPipe,
  id,
  data,
}) => {
  const { generalData, avatarData } = getData[gameId];
  const { SECTIONS, RANK_PREFIX } = generalData;
  const { avatarIcons } = getIcons[gameId];
  
  const openModal = () => {
    setModalPipe({
      type: "avatar",
      id,
      data,
    });
  };

  return (
    <Tooltip title={`Edit ${SECTIONS[0]}`} arrow>
      <Stack
        onClick={openModal}
        display="inline-flex"
        direction="row"
        alignItems="center"
        spacing={1}
      >
        <Badge
          badgeContent={
            <strong>{RANK_PREFIX}{data.rank}</strong>
          }
        >
          <Avatar
            alt={avatarData[id].name}
            src={avatarIcons[`./${id}.webp`]?.default}
          />
        </Badge>
        
        <Typography variant="body2">
          {avatarData[id].name}
        </Typography>
      </Stack>
    </Tooltip>
  );
};

export default Table1Avatar;
