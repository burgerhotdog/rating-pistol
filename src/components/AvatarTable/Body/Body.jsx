import { TableBody, TableRow, TableCell, Skeleton, Stack } from "@mui/material";
import StarCell from "./StarCell";
import AvatarCell from "./AvatarCell";
import WeaponCell from "./WeaponCell";
import EquipCell from "./EquipCell";
import RatingCell from "./RatingCell";
import DeleteCell from "./DeleteCell";

export default ({ gameId, userId, avatarCache, setAvatarCache, isLoading, sortedAvatars, setModalPipe }) => {
  if (isLoading) {
    return (
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index} sx={{ height: 60 }}>
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
              <Skeleton variant="rounded" width={80} height={36} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width={80} height={36} />
            </TableCell>
            <TableCell>
              <Skeleton variant="rounded" width={60} height={36} />
            </TableCell>
            <TableCell>
              <Skeleton variant="circular" width={24} height={24} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    )
  }

  return (
    <TableBody>
      {sortedAvatars.map((avatarId) => (
        <TableRow
          key={avatarId}
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
            setAvatarCache={setAvatarCache}
            id={avatarId}
            data={avatarCache[avatarId].data}
          />
          
          <AvatarCell
            gameId={gameId}
            setModalPipe={setModalPipe}
            id={avatarId}
            data={avatarCache[avatarId].data}
          />

          <WeaponCell
            gameId={gameId}
            setModalPipe={setModalPipe}
            id={avatarId}
            data={avatarCache[avatarId].data}
          />

          <EquipCell
            gameId={gameId}
            setModalPipe={setModalPipe}
            id={avatarId}
            data={avatarCache[avatarId].data}
          />

          <RatingCell
            gameId={gameId}
            setModalPipe={setModalPipe}
            id={avatarId}
            data={avatarCache[avatarId].data}
            rating={avatarCache[avatarId].rating}
          />

          <DeleteCell
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
