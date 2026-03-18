import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Box } from '@mui/material';
import { ALL_CHARACTER_ASSETS } from '@/assets';

export const Sidebar = ({ sortedIds, selectedId, setSelectedId }) => {
  const { gameId } = useParams();
  const CHARACTER_ASSETS = ALL_CHARACTER_ASSETS[gameId];
  const prevGameId = useRef(gameId);

  useEffect(() => {
    // if no characters, reset selectedId to null
    if (!sortedIds.length) return setSelectedId(null);

    // if gameId changed, reset selectedId to first character
    if (prevGameId.current !== gameId) {
      prevGameId.current = gameId;
      return setSelectedId(sortedIds[0]);
    }

    // if selectedId no longer exists, reset to first character
    if (!sortedIds.includes(selectedId)) {
      return setSelectedId(sortedIds[0]);
    }
  }, [sortedIds]);

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
        {sortedIds.map((characterId) => (
          <Avatar
            key={characterId}
            src={CHARACTER_ASSETS[characterId]}
            onClick={() => setSelectedId(characterId)}
            sx={{
              width: 46,
              height: 46,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s ease',
              outline: selectedId === characterId
                ? '2px solid'
                : '2px solid transparent',
              outlineColor: selectedId === characterId
                ? 'primary.main'
                : 'transparent',
              outlineOffset: 2,
              opacity: selectedId === characterId ? 1 : 0.55,
              filter: selectedId === characterId ? 'none' : 'grayscale(0.4)',
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
