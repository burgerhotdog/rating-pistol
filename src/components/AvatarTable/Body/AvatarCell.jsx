import React from "react";
import { Avatar, Badge, Tooltip, Stack, Typography } from "@mui/material";
import AVATAR_ASSETS from "@assets/dynamic/avatar";
import AVATARS from "@data/dynamic/avatars";
import { INFO, LABELS } from "@data/static";
import TableCell from "@mui/material/TableCell";

const AvatarCell = ({ gameId, setPipe, id, data }) => {
  const openModal = () => setPipe({ type: "avatar", id, data });

  return (
    <TableCell align="left">
      <Tooltip title={`Edit ${LABELS[gameId].Avatar}`} arrow>
        <Stack
          onClick={openModal}
          display="inline-flex"
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ cursor: "pointer" }}
        >
          <Badge
            badgeContent={<strong>{INFO[gameId].PREFIX_AVATAR}{data.rank}</strong>}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "rgba(20, 20, 20, 0.4)",
              },
            }}
          >
            <Avatar
              alt={AVATARS[gameId][id].name}
              src={AVATAR_ASSETS[`./${gameId}/${id}.webp`]?.default}
            />
          </Badge>
          
          <Typography variant="body2">
            {AVATARS[gameId][id].name}
          </Typography>
        </Stack>
      </Tooltip>
    </TableCell>
  );
};

export default AvatarCell;
