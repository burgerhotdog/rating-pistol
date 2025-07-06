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
  const [onlyStarred, setOnlyStarred] = useState(false);

  return (
    <TableContainer 
      component={Paper} 
      sx={{
        maxHeight: 600,
        overflow: "auto",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Table stickyHeader sx={{ tableLayout: "fixed", width: "100%" }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <StarHead starOnly={onlyStarred} setStarOnly={setOnlyStarred} />
            </TableCell>
            <TableCell>
              <AvatarHead gameId={gameId} />
            </TableCell>
            <TableCell>
              <RatingHead />
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
