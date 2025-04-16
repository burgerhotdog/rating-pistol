import React from "react";
import { TableHead, TableRow, TableCell, Typography } from "@mui/material";
import { LABELS } from "@data";
import StarHead from "./StarHead";
import DeleteHead from "./DeleteHead";

export default ({ gameId, userId, localDocs, setLocalDocs }) => {
  return (
    <TableHead>
      <TableRow>
        <StarHead />

        <TableCell align="left">
          <Typography variant="body1" color="text.secondary">
            {LABELS[gameId].Avatar}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body1" color="text.secondary">
            {LABELS[gameId].Weapon}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body1" color="text.secondary">
            {LABELS[gameId].Equips}
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
          localDocs={localDocs}
          setLocalDocs={setLocalDocs}
        />
      </TableRow>
    </TableHead>
  );
};
