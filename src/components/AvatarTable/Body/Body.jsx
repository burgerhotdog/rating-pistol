import React from "react";
import { TableBody, TableRow, TableCell, Skeleton, Stack } from "@mui/material";
import StarCell from "./StarCell";
import AvatarCell from "./AvatarCell";
import WeaponCell from "./WeaponCell";
import EquipCell from "./EquipCell";
import RatingCell from "./RatingCell";
import DeleteCell from "./DeleteCell";

const cellStyle = { 
  verticalAlign: "middle", 
  height: 60, 
  textAlign: "center" 
};

const avatarCellStyle = {
  ...cellStyle,
  textAlign: "left"
};

export default ({ gameId, userId, localDocs, setLocalDocs, isLoading, sortedDocs, setPipe }) => {
  if (isLoading) {
    return (
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell align="center" sx={{ ...cellStyle, width: 50 }}>
              <Stack display="inline-flex" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <Skeleton variant="circular" width={24} height={24} />
              </Stack>
            </TableCell>

            <TableCell sx={avatarCellStyle}>
              <Stack direction="row" display="inline-flex" spacing={1} sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width={120} />
              </Stack>
            </TableCell>

            <TableCell sx={cellStyle}>
              <Stack display="inline-flex" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <Skeleton variant="rounded" width={80} height={36} />
              </Stack>
            </TableCell>

            <TableCell sx={cellStyle}>
              <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <Skeleton variant="text" width={80} height={36} />
              </Stack>
            </TableCell>

            <TableCell sx={cellStyle}>
              <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <Skeleton variant="rounded" width={60} height={36} />
              </Stack>
            </TableCell>

            <TableCell sx={{ ...cellStyle, width: 50 }}>
              <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
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
      {sortedDocs.map(({ id, data, rating }) => (
        <TableRow
          key={id}
          sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.03)" } }}
        >
          <TableCell sx={{ ...cellStyle, width: 50 }}>
            <StarCell
              gameId={gameId}
              userId={userId}
              setLocalDocs={setLocalDocs}
              id={id}
              data={data}
            />
          </TableCell>
          
          <TableCell sx={avatarCellStyle}>
            <AvatarCell
              gameId={gameId}
              setPipe={setPipe}
              id={id}
              data={data}
            />
          </TableCell>

          <TableCell sx={cellStyle}>
            <WeaponCell
              gameId={gameId}
              setPipe={setPipe}
              id={id}
              data={data}
            />
          </TableCell>

          <TableCell sx={cellStyle}>
            <EquipCell
              gameId={gameId}
              setPipe={setPipe}
              id={id}
              data={data}
            />
          </TableCell>

          <TableCell sx={cellStyle}>
            <RatingCell
              setPipe={setPipe}
              id={id}
              data={data}
              rating={rating}
            />
          </TableCell>

          <TableCell sx={{ ...cellStyle, width: 50 }}>
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
