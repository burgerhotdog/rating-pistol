import React from "react";
import { TableBody, TableRow, TableCell, Skeleton } from "@mui/material";
import StarCell from "./StarCell";
import AvatarCell from "./AvatarCell";
import WeaponCell from "./WeaponCell";
import EquipCell from "./EquipCell";
import RatingCell from "./RatingCell";
import DeleteCell from "./DeleteCell";

const AvatarTable = ({ gameId, userId, localDocs, setLocalDocs, isLoading, sortedDocs, setPipe }) => {

  if (isLoading) {
    return (
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell align="center"><Skeleton variant="circular" width={30} height={30} /></TableCell>
            <TableCell><Skeleton variant="text" width="80%" height={40} /></TableCell>
            <TableCell align="center"><Skeleton variant="rounded" width={80} height={40} /></TableCell>
            <TableCell align="center"><Skeleton variant="text" width="90%" height={40} /></TableCell>
            <TableCell align="center"><Skeleton variant="rounded" width={60} height={40} /></TableCell>
            <TableCell sx={{ borderBottom: "none" }} />
          </TableRow>
        ))}
      </TableBody>
    )
  }

  return (
    <TableBody>
      {sortedDocs.map(({ id, data, rating }) => (
        <TableRow
          key={id}
          sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.03)" } }}
        >
          <TableCell align="center">
            <StarCell
              gameId={gameId}
              userId={userId}
              setLocalDocs={setLocalDocs}
              id={id}
              data={data}
            />
          </TableCell>
          <TableCell>
            <AvatarCell
              gameId={gameId}
              setPipe={setPipe}
              id={id}
              data={data}
            />
          </TableCell>
          <TableCell align="center">
            <WeaponCell
              gameId={gameId}
              setPipe={setPipe}
              id={id}
              data={data}
            />
          </TableCell>
          <TableCell align="center">
            <EquipCell
              gameId={gameId}
              setPipe={setPipe}
              id={id}
              data={data}
            />
          </TableCell>
          <TableCell align="center">
            <RatingCell
              setPipe={setPipe}
              id={id}
              data={data}
              rating={rating}
            />
          </TableCell>
          <TableCell align="center">
            <DeleteCell
              gameId={gameId}
              userId={userId}
              id={id}
              setLocalDocs={setLocalDocs}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default AvatarTable;

