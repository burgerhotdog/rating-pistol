import { Skeleton, Stack, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, Typography } from "@mui/material";
import { StarBody, AvatarBody, RatingBody } from "./Cells";

const CustomTable = ({ gameId, userId, avatarCache, setAvatarCache, isLoading, sortedAvatars, setModalPipe }) => {
  return (
    <TableContainer 
      component={Paper}
      sx={{
        maxHeight: 650,
        overflow: "auto",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Table stickyHeader sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell width={50} />
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
        <TableBody>
          {isLoading ? (
            [...Array(10)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="circular" width={24} height={24} />
                </TableCell>
                <TableCell>
                  <Stack direction="row" display="inline-flex" spacing={1}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={120} height={36} />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Skeleton variant="rounded" width={60} height={36} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            sortedAvatars.map((avatarId) => (
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
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
