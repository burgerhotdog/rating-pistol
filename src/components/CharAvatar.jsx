import { Avatar } from '@mui/material';
import { CHARACTER } from '@/data';

export const CharAvatar = ({ gameId, charId }) => {
  return (
    <Avatar
      variant="rounded"
      src={`${gameId}/character/${charId}.webp`}
      alt={CHARACTER[gameId][charId]?.name ?? ''}
      slotProps={{
        img: {
          style: {
            objectFit: 'cover',
            objectPosition: 'top center',
          },
        },
      }}
    />
  )
};
