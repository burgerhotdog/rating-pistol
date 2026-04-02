import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Card, List, ListItemButton } from '@mui/material';
import { useSortedCharacters } from '@/hooks';

export const Sidebar = () => {
  const navigate = useNavigate();
  const { gameId, characterId } = useParams();

  const characterList = useSortedCharacters();

  // Autonavigate scenarios
  useEffect(
    () => {
      if (characterList.length === 0) {
        if (!characterId) return;
        navigate(`/${gameId}`, { replace: true });
      } else {
        if (characterList.includes(characterId)) return;
        navigate(`/${gameId}/${characterList[0]}`, { replace: true });
      }
    },
    [gameId, characterId, characterList, navigate],
  );

  const handleSelect = (id) => {
    if (characterId === id) return;
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
        {characterList.map((id) => (
          <ListItemButton
            key={id}
            selected={characterId === id}
            onClick={() => handleSelect(id)}
          >
            <Avatar
              src={`${import.meta.env.BASE_URL}${gameId}/character/${id}.webp`}
              sx={{ width: 48, height: 48 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Card>
  );
};
