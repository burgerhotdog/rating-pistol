import React from "react";
import { Avatar, Badge, Tooltip, Stack, Typography } from "@mui/material";
import { ASSETS, DATA } from "../importData";

const Table1Avatar = ({ gameId, setPipe, id, data }) => {
  const { AVATAR_IMGS } = ASSETS[gameId];
  const { HEADERS, PREFIX, AVATAR_DATA } = DATA[gameId];
  
  const openModal = () => setPipe({ type: "avatar", id, data });

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
          badgeContent={<strong>{PREFIX}{data.rank}</strong>}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "rgba(20, 20, 20, 0.4)",
            },
          }}
        >
          <Avatar
            alt={AVATAR_DATA[id].name}
            src={AVATAR_IMGS[`./${id}.webp`]?.default}
          />
        </Badge>
        
        <Typography variant="body2">
          {AVATAR_DATA[id].name}
        </Typography>
      </Stack>
    </Tooltip>
  );
};

export default Table1Avatar;
