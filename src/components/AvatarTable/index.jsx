import React from "react";
import { TableContainer, Table } from "@mui/material";
import TableHead from "./TableHead";
import TableBody from "./TableBody";

const AvatarTable = ({ gameId, userId, localDocs, setLocalDocs, isLoading, sortedDocs, setPipe }) => {
  return (
    <TableContainer sx={{ maxWidth: 900, mt: 2 }}>
      <Table sx={{ tableLayout: "fixed", width: "100%" }}>
        <TableHead gameId={gameId} userId={userId} localDocs={localDocs} setLocalDocs={setLocalDocs} />
        <TableBody
          gameId={gameId}
          userId={userId}
          localDocs={localDocs}
          setLocalDocs={setLocalDocs}
          isLoading={isLoading}
          sortedDocs={sortedDocs}
          setPipe={setPipe}
        />
      </Table>
    </TableContainer>
  );
};

export default AvatarTable;

