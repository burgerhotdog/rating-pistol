import { useState } from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, Paper, TablePagination, TableBody } from "@mui/material";
import { StarBorder } from "@mui/icons-material";
import { LABEL_DATA } from "@data";
import DeleteHead from "./DeleteHead";
import { Star, Avatar, Weapon, Equip, Rating, Delete } from "./Cells";
import CustomSkeleton from "./Skeleton";

const CustomBody = ({ gameId, userId, avatarCache, setAvatarCache, isLoading, sortedAvatars, setModalPipe }) => {
  if (isLoading) {
    return (
      <CustomSkeleton />
    )
  }

  return (
    <TableBody>
      {sortedAvatars.map((avatarId) => (
        <TableRow
          key={avatarId}
          sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.03)" } }}
        >
          <Star
            gameId={gameId}
            userId={userId}
            setAvatarCache={setAvatarCache}
            id={avatarId}
            data={avatarCache[avatarId].data}
          />
          <Avatar
            gameId={gameId}
            setModalPipe={setModalPipe}
            id={avatarId}
            data={avatarCache[avatarId].data}
          />
          <Weapon
            gameId={gameId}
            setModalPipe={setModalPipe}
            id={avatarId}
            data={avatarCache[avatarId].data}
          />
          <Equip
            gameId={gameId}
            setModalPipe={setModalPipe}
            id={avatarId}
            data={avatarCache[avatarId].data}
          />
          <Rating
            gameId={gameId}
            setModalPipe={setModalPipe}
            id={avatarId}
            data={avatarCache[avatarId].data}
            rating={avatarCache[avatarId].rating}
          />
          <Delete
            gameId={gameId}
            userId={userId}
            id={avatarId}
            setAvatarCache={setAvatarCache}
          />
        </TableRow>
      ))}
    </TableBody>
  );
};

const AvatarTable = ({ gameId, userId, avatarCache, setAvatarCache, isLoading, sortedAvatars, setModalPipe }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
        borderRadius: 2,
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Table sx={{ tableLayout: "fixed", width: "100%" }}>
        <TableHead>
          <TableRow>
            <TableCell width={50}>
              <StarBorder color="disabled" />
            </TableCell>
            <TableCell 
              width={200} 
              sx={{ color: "text.secondary", fontWeight: "bold" }}
            >
              {LABEL_DATA[gameId].Avatar}
            </TableCell>
            <TableCell 
              width={250} 
              sx={{ color: "text.secondary", fontWeight: "bold" }}
            >
              {LABEL_DATA[gameId].Weapon}
            </TableCell>
            <TableCell 
              width={300} 
              sx={{ color: "text.secondary", fontWeight: "bold" }}
            >
              {LABEL_DATA[gameId].Equips}
            </TableCell>
            <TableCell 
              width={150} 
              sx={{ color: "text.secondary", fontWeight: "bold" }}
            >
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
