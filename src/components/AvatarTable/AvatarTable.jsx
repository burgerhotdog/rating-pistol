import React from "react";
import { TableContainer, Table } from "@mui/material";
import Head from "./Head";
import Body from "./Body";

const AvatarTable = ({ gameId, userId, localDocs, setLocalDocs, isLoading, sortedDocs, setPipe }) => {
  return (
    <TableContainer>
      <Table sx={{ tableLayout: "fixed", width: "100%" }}>
        <Head
          gameId={gameId}
          userId={userId}
          localDocs={localDocs}
          setLocalDocs={setLocalDocs}
        />
        <Body
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
