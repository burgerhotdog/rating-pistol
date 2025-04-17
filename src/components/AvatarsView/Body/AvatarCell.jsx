import React from "react";
import { Avatar, Badge, Tooltip, Stack, Typography, TableCell } from "@mui/material";
import { AVATAR_ASSETS } from "@assets";
import { AVATAR_DATA, INFO_DATA, LABEL_DATA } from "@data";

const AvatarCell = ({ gameId, setPipe, id, data }) => {
  const openModal = () => setPipe({ type: "avatar", id, data });

  return (
    <TableCell align="left">
      <Tooltip title={`Edit ${LABEL_DATA[gameId].Avatar}`} arrow>
        <Stack
          onClick={openModal}
          display="inline-flex"
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ cursor: "pointer" }}
        >
          <Badge badgeContent={`${INFO_DATA[gameId].PREFIX_AVATAR}${data.rank}`}>
            <Avatar
              alt={AVATAR_DATA[gameId][id].name}
              src={AVATAR_ASSETS[gameId][id]}
            />
          </Badge>
          
          <Typography variant="body2">
            {AVATAR_DATA[gameId][id].name}
          </Typography>
        </Stack>
      </Tooltip>
    </TableCell>
  );
};

export default AvatarCell;
