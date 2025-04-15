import React from "react";
import { TableBody, TableRow, TableCell, Skeleton, Stack } from "@mui/material";
import StarCell from "./StarCell";
import AvatarCell from "./AvatarCell";
import WeaponCell from "./WeaponCell";
import EquipCell from "./EquipCell";
import RatingCell from "./RatingCell";
import DeleteCell from "./DeleteCell";

export default ({ gameId, userId, localDocs, setLocalDocs, isLoading, sortedDocs, setPipe }) => {
  if (isLoading) {
    return (
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index} sx={{ height: 60 }}>
            <TableCell align="center" width={50}>
              <Stack direction="row" display="inline-flex">
                <Skeleton variant="circular" width={24} height={24} />
              </Stack>
            </TableCell>

            <TableCell align="left">
              <Stack direction="row" display="inline-flex" spacing={1}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width={120} height={36} />
              </Stack>
            </TableCell>

            <TableCell align="center">
              <Stack direction="row" display="inline-flex">
                <Skeleton variant="rounded" width={80} height={36} />
              </Stack>
            </TableCell>

            <TableCell align="center">
              <Stack direction="row" display="inline-flex">
                <Skeleton variant="text" width={80} height={36} />
              </Stack>
            </TableCell>

            <TableCell align="center">
              <Stack direction="row" display="inline-flex">
                <Skeleton variant="rounded" width={60} height={36} />
              </Stack>
            </TableCell>

            <TableCell align="center" width={50}>
              <Stack direction="row" display="inline-flex">
                <Skeleton variant="circular" width={24} height={24} />
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    )
  }

  return (
    <TableBody>
      {sortedDocs.map(({ id, data, rating, rawRating }) => (
        <TableRow
          key={id}
          sx={{
            height: 60,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.03)",
            },
          }}
        >
          <StarCell
            gameId={gameId}
            userId={userId}
            setLocalDocs={setLocalDocs}
            id={id}
            data={data}
          />
          
          <AvatarCell
            gameId={gameId}
            setPipe={setPipe}
            id={id}
            data={data}
          />

          <WeaponCell
            gameId={gameId}
            setPipe={setPipe}
            id={id}
            data={data}
          />

          <EquipCell
            gameId={gameId}
            setPipe={setPipe}
            id={id}
            data={data}
          />

          <RatingCell
            setPipe={setPipe}
            id={id}
            data={data}
            rating={rating}
            rawRating={rawRating}
          />

          <DeleteCell
            gameId={gameId}
            userId={userId}
            id={id}
            setLocalDocs={setLocalDocs}
          />
        </TableRow>
      ))}
    </TableBody>
  );
};
