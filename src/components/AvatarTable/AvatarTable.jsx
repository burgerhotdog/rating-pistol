import { useState } from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, Paper, TablePagination, TableBody } from "@mui/material";
import {
  StarHead, StarBody,
  AvatarHead, AvatarBody,
  WeaponHead, WeaponBody,
  EquipHead, EquipBody,
  RatingHead, RatingBody,
  DeleteHead, DeleteBody,
} from "./Cells";
import CustomSkeleton from "./Skeleton";

const CustomBody = ({ gameId, userId, avatarCache, setAvatarCache, isLoading, sortedAvatars, setModalPipe }) => {
  if (isLoading) {
    return (<CustomSkeleton />)
  }

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
            <WeaponBody
              gameId={gameId}
              setModalPipe={setModalPipe}
              id={avatarId}
              data={avatarCache[avatarId].data}
            />
          </TableCell>
          <TableCell>
            <EquipBody
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
          <TableCell>
            <DeleteBody
              gameId={gameId}
              userId={userId}
              id={avatarId}
              setAvatarCache={setAvatarCache}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

const AvatarTable = ({ gameId, userId, avatarCache, setAvatarCache, isLoading, sortedAvatars, setModalPipe }) => {
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAvatars = sortedAvatars.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer 
      component={Paper} 
      sx={{
        overflowX: "auto",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Table sx={{ tableLayout: "fixed", width: "100%" }}>
        <TableHead>
          <TableRow>
            <TableCell width={50}>
              <StarHead starOnly={onlyStarred} setStarOnly={setOnlyStarred} />
            </TableCell>
            <TableCell width={200}>
              <AvatarHead gameId={gameId} />
            </TableCell>
            <TableCell width={250}>
              <WeaponHead gameId={gameId} />
            </TableCell>
            <TableCell width={300}>
              <EquipHead gameId={gameId} />
            </TableCell>
            <TableCell width={150}>
              <RatingHead />
            </TableCell>
            <TableCell width={50}>
              <DeleteHead
                gameId={gameId}
                userId={userId}
                avatarCache={avatarCache}
                setAvatarCache={setAvatarCache}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <CustomBody
          gameId={gameId}
          userId={userId}
          avatarCache={avatarCache}
          setAvatarCache={setAvatarCache}
          isLoading={isLoading}
          sortedAvatars={paginatedAvatars}
          setModalPipe={setModalPipe}
        />
      </Table>
      <TablePagination
        component="div"
        count={sortedAvatars.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          color: "text.secondary",
          ".MuiTablePagination-select": {
            color: "text.secondary",
          },
          ".MuiTablePagination-selectIcon": {
            color: "text.secondary",
          },
          ".MuiTablePagination-displayedRows": {
            color: "text.secondary",
          },
          ".MuiTablePagination-actions": {
            color: "text.secondary",
          },
        }}
      />
    </TableContainer>
  );
};

export default AvatarTable;
