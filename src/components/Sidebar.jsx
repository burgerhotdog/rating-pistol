import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Card, List, ListItemButton } from '@mui/material';
import { CHARACTER_ASSETS } from '@/assets';
import { CHARACTERS } from '@/lookups';

export const Sidebar = ({ buildKeys, pinned }) => {
  const navigate = useNavigate();
  const { gameId, charId } = useParams();

  // Sort characters alphabetically with pinned on top
  const charList = useMemo(
    () => buildKeys.sort((a, b) => {
      if (a === pinned) return -1;
      if (b === pinned) return 1;

      const aName = CHARACTERS[gameId][a].NAME;
      const bName = CHARACTERS[gameId][b].NAME;
      return aName.localeCompare(bName);
    }),
    [gameId, buildKeys, pinned],
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
    <Card
      sx={{
        overflowY: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <List sx={{ p: 0 }}>
        {charList.map((id) => (
          <ListItemButton
            key={id}
            selected={charId === id}
            onClick={() => handleSelect(id)}
          >
            <Avatar
              src={CHARACTER_ASSETS[gameId][id]}
              sx={{ width: 48, height: 48 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Card>
  );
};
