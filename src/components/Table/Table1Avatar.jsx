import React from "react";
import { Avatar, Badge, Tooltip, Stack, Typography } from "@mui/material";
import getData from "../getData";
import getImgs from "../getImgs";

const Table1Avatar = ({
  gameId,
  setModalPipe,
  id,
  data,
}) => {
  const { HEADERS, PREFIX, AVATAR_DATA } = getData[gameId];
  const { AVATAR_IMGS } = getImgs[gameId];
  
  const openModal = () => {
    setModalPipe({
      type: "avatar",
      id,
      data,
    });
  };

  return (
    <Tooltip title={`Edit ${HEADERS.avatar}`} arrow>
      <Stack
        onClick={openModal}
        display="inline-flex"
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ cursor: "pointer" }}
      >
        <Badge
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "rgba(20, 20, 20, 0.2)",
            },
          }}
          badgeContent={
            <strong>{PREFIX}{data.rank}</strong>
          }
        >
          <Avatar
            alt={AVATAR_DATA[id].name}
            src={AVATAR_IMGS[`./${id}.webp`]?.default}
          />
        </Badge>
        
        <Typography
          onClick={openModal}
          variant="body2"
        >
          {AVATAR_DATA[id].name}
        </Typography>
      </Stack>
    </Tooltip>
  );
};

export default Table1Avatar;
