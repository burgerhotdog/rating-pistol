import React from "react";
import { Avatar, Badge, Tooltip, Stack, Typography } from "@mui/material";
import AVATAR_ASSETS from "@assets/avatar";
import AVATAR_DATA from "@data/avatar";

const PREFIX = { gi: "C", hsr: "E", ww: "S", zzz: "M" };

const Table1Avatar = ({ gameId, setPipe, id, data }) => {
  const openModal = () => setPipe({ type: "avatar", id, data });

  return (
    <Tooltip title="Edit" arrow>
      <Stack
        onClick={openModal}
        display="inline-flex"
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ cursor: "pointer" }}
      >
        <Badge
          badgeContent={<strong>{PREFIX[gameId]}{data.rank}</strong>}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "rgba(20, 20, 20, 0.4)",
            },
          }}
        >
          <Avatar
            alt={AVATAR_DATA[gameId][id].name}
            src={AVATAR_ASSETS[`./${gameId}/${id}.webp`]?.default}
          />
        </Badge>
        
        <Typography variant="body2">
          {AVATAR_DATA[gameId][id].name}
        </Typography>
      </Stack>
    </Tooltip>
  );
};

export default Table1Avatar;
