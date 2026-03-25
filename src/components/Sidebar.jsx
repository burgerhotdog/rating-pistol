import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, List, ListItemButton } from '@mui/material';
import { CHARACTER_ASSETS } from '@/assets';
import { CHARACTER_LOOKUP } from '@/lookups';

export const Sidebar = ({ buildKeys, pinnedId }) => {
  const navigate = useNavigate();
  const { gameId, charId } = useParams();

  // Sort characters alphabetically with pinned on top
  const charList = useMemo(
    () => buildKeys.sort((a, b) => {
      if (a === pinnedId) return -1;
      if (b === pinnedId) return 1;

      const aName = CHARACTER_LOOKUP[gameId][a].NAME;
      const bName = CHARACTER_LOOKUP[gameId][b].NAME;
      return aName.localeCompare(bName);
    }),
    [gameId, buildKeys, pinnedId],
  );

  // Autonavigate scenarios
  useEffect(
    () => {
      if (charList.length === 0) {
        if (!charId) return;
        navigate(`/${gameId}`, { replace: true });
      } else {
        if (charList.includes(charId)) return;
        navigate(`/${gameId}/${charList[0]}`, { replace: true });
      }
    },
    [gameId, charId, charList, navigate],
  );

  const handleSelect = (id) => {
    if (charId === id) return;
    navigate(`/${gameId}/${id}`, { replace: true });
  };

  return (
    <List
      sx={{
        overflowY: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {charList.map((id) => (
        <ListItemButton
          key={id}
          selected={charId === id}
          onClick={() => handleSelect(id)}
        >
          <Avatar src={CHARACTER_ASSETS[gameId][id]} />
        </ListItemButton>
      ))}
    </List>
  );
};
