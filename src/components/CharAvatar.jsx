import { Avatar } from '@mui/material';
import { CHARACTER } from '@/data';

export const CharAvatar = ({ gameId, charId }) => {
  const { name, icon } = CHARACTER[gameId][charId] ?? {};
  return (
    <Avatar
      variant="rounded"
      src={icon}
      alt={name ?? ''}
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
