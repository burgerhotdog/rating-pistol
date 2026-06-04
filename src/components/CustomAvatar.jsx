import { Avatar } from '@mui/material';
import { CHARACTER } from '@/data';

export const CustomAvatar = ({ gameId, characterId }) => {
  return (
    <Avatar
      variant="rounded"
      src={`${gameId}/character/${characterId}.webp`}
      alt={CHARACTER[gameId][characterId]?.name ?? ""}
      sx={{
        width: 48,
        height: 48,
        "& .MuiAvatar-img": {
          objectFit: "cover",
          objectPosition: "top center",
        },
      }}
    />
  )
};
