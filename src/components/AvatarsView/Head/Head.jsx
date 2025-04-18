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

        <TableCell>
          <Typography variant="body1" color="text.secondary">
            {LABEL_DATA[gameId].Avatar}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body1" color="text.secondary">
            {LABEL_DATA[gameId].Weapon}
          </Typography>
        </TableCell>

        <TableCell width={250}>
          <Typography variant="body1" color="text.secondary">
            {LABEL_DATA[gameId].Equips}
          </Typography>
        </TableCell>

        <TableCell width={200}>
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
