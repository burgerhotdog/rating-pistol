import { TableContainer, Table } from "@mui/material";
import Head from "./Head";
import Body from "./Body";

const AvatarsView = ({ gameId, userId, avatarCache, setAvatarCache, isLoading, sortedDocs, setModalPipe }) => {
  return (
    <TableContainer>
      <Table sx={{ tableLayout: "fixed", width: "100%" }}>
        <Head
          gameId={gameId}
          userId={userId}
          avatarCache={avatarCache}
          setAvatarCache={setAvatarCache}
        />
        <Body
          gameId={gameId}
          userId={userId}
          avatarCache={avatarCache}
          setAvatarCache={setAvatarCache}
          isLoading={isLoading}
          sortedDocs={sortedDocs}
          setModalPipe={setModalPipe}
        />
      </Table>
    </TableContainer>
  );
};

export default AvatarsView;
