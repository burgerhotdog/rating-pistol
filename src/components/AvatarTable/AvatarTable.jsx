import { TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, Typography } from "@mui/material";
import { StarBody, AvatarBody, RatingBody } from "./Cells";
import CustomSkeleton from "./Skeleton";

const CustomBody = ({ gameId, userId, avatarCache, setAvatarCache, isLoading, sortedAvatars, setModalPipe }) => {
  if (isLoading) return (<CustomSkeleton />);
  return (
    <TableBody>
      {sortedAvatars.map((avatarId) => (
        <TableRow
          key={avatarId}
          sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.03)" } }}
        >
          <TableCell>
            <StarBody
              gameId={gameId}
              userId={userId}
              setAvatarCache={setAvatarCache}
              id={avatarId}
              data={avatarCache[avatarId].data}
            />
          </TableCell>
          <TableCell>
            <AvatarBody
              gameId={gameId}
              setModalPipe={setModalPipe}
              id={avatarId}
              data={avatarCache[avatarId].data}
            />
          </TableCell>
          <TableCell>
            <RatingBody
              gameId={gameId}
              setModalPipe={setModalPipe}
              id={avatarId}
              data={avatarCache[avatarId].data}
              rating={avatarCache[avatarId].rating}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

const AvatarTable = ({ gameId, userId, avatarCache, setAvatarCache, isLoading, sortedAvatars, setModalPipe }) => {
  return (
    <TableContainer 
      component={Paper} 
      sx={{
        maxHeight: 650,
        overflow: "auto",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Table stickyHeader sx={{ tableLayout: "fixed", width: "100%" }}>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <Typography variant="body1" fontWeight="bold">
                Character
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" fontWeight="bold">
                Rating
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <CustomBody
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
