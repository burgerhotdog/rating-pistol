import React from "react";
import { TableHead, TableRow, TableCell } from "@mui/material";
import LABELS from "@data/static/labels";
import DeleteAll from "./DeleteAll";

export default ({ gameId, userId, localDocs, setLocalDocs }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell align="center" sx={{ width: 50 }} />
        <TableCell sx={{ width: 250 }}>{LABELS[gameId].Avatar}</TableCell>
        <TableCell align="center" sx={{ width: 125 }}>{LABELS[gameId].Weapon}</TableCell>
        <TableCell align="center" sx={{ width: 250 }}>{LABELS[gameId].Equip}</TableCell>
        <TableCell align="center" sx={{ width: 125 }}>Rating</TableCell>
        <TableCell align="center" sx={{ width: 50 }}>
          <DeleteAll
            gameId={gameId}
            userId={userId}
            localDocs={localDocs}
            setLocalDocs={setLocalDocs}
          />
        </TableCell>
      </TableRow>
    </TableHead>
  );
};
