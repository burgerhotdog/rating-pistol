import React from "react";
import { TableHead, TableRow, TableCell, Typography } from "@mui/material";
import { LABEL_DATA } from "@data";
import StarHead from "./StarHead";
import DeleteHead from "./DeleteHead";

export default ({ gameId, userId, avatarCache, setAvatarCache }) => {
  return (
    <TableHead>
      <TableRow>
        <StarHead />

        <TableCell align="left">
          <Typography variant="body1" color="text.secondary">
            {LABEL_DATA[gameId].Avatar}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body1" color="text.secondary">
            {LABEL_DATA[gameId].Weapon}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body1" color="text.secondary">
            {LABEL_DATA[gameId].Equips}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body1" color="text.secondary">
            Rating
          </Typography>
        </TableCell>

        <DeleteHead
          gameId={gameId}
          userId={userId}
          avatarCache={avatarCache}
          setAvatarCache={setAvatarCache}
        />
      </TableRow>
    </TableHead>
  );
};
