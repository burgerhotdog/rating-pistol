import { TableContainer, Table, TableHead, TableRow, TableCell, Typography, Paper } from "@mui/material";
import { StarBorder } from "@mui/icons-material";
import { LABEL_DATA } from "@data";
import DeleteHead from "./DeleteHead";
import Body from "./Body";

const AvatarTable = ({ gameId, userId, avatarCache, setAvatarCache, isLoading, sortedAvatars, setModalPipe }) => {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table sx={{ tableLayout: "fixed", width: "100%" }}>
        <TableHead>
          <TableRow>
            <TableCell width={50}>
              <StarBorder color="disabled" />
            </TableCell>
            <TableCell width={200} sx={{ color: "text.secondary", fontWeight: "bold" }}>
              {LABEL_DATA[gameId].Avatar}
            </TableCell>
            <TableCell width={250} sx={{ color: "text.secondary", fontWeight: "bold" }}>
              {LABEL_DATA[gameId].Weapon}
            </TableCell>
            <TableCell width={300} sx={{ color: "text.secondary", fontWeight: "bold" }}>
              {LABEL_DATA[gameId].Equips}
            </TableCell>
            <TableCell width={150} sx={{ color: "text.secondary", fontWeight: "bold" }}>
              Rating
            </TableCell>
            <DeleteHead
              gameId={gameId}
              userId={userId}
              avatarCache={avatarCache}
              setAvatarCache={setAvatarCache}
            />
          </TableRow>
        </TableHead>
        <Body
          gameId={gameId}
          userId={userId}
          avatarCache={avatarCache}
          setAvatarCache={setAvatarCache}
          isLoading={isLoading}
          sortedAvatars={sortedAvatars}
          setModalPipe={setModalPipe}
        />
      </Table>
    </TableContainer>
  );
};

export default AvatarTable;
