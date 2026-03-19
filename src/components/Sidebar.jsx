import { useParams } from 'react-router-dom';
import { Avatar, Box } from '@mui/material';
import { CHARACTER_ASSETS } from '@/assets';

export const Sidebar = ({ charList, onSelectId }) => {
  const { gameId, charId } = useParams();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 72,
      flexShrink: 0,
    }}>
      <Box sx={{
        flex: 1,
        minHeight: 0,
        width: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        py: 1,
        px: 0.5,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'sticky',
          bottom: 0,
          display: 'block',
          width: '100%',
          height: 40,
          flexShrink: 0,
          background: (theme) =>
            `linear-gradient(transparent, ${theme.palette.background.default})`,
          pointerEvents: 'none',
        },
      }}>
        {charList.map((id) => (
          <Avatar
            key={id}
            src={CHARACTER_ASSETS[gameId][id]}
            onClick={() => onSelectId(id)}
            sx={{
              width: 46,
              height: 46,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s ease',
              outline: charId === id
                ? '2px solid'
                : '2px solid transparent',
              outlineColor: charId === id
                ? 'primary.main'
                : 'transparent',
              outlineOffset: 2,
              opacity: charId === id ? 1 : 0.55,
              filter: charId === id ? 'none' : 'grayscale(0.4)',
              '&:hover': {
                opacity: 1,
                filter: 'none',
                transform: 'scale(1.05)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
