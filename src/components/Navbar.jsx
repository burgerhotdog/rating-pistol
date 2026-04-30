import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Tab, Tabs } from '@mui/material';

export const Navbar = ({ sorted }) => {
  const { gameId, characterId } = useParams();
  const navigate = useNavigate();

  const handleChange = (_, id) => {
    if (characterId === id) return;
    navigate(`/${gameId}/${id}`, { replace: true });
  };

  return (
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={characterId ?? false}
        onChange={handleChange}
      >
        {sorted.map((id) => (
          <Tab
            key={id}
            value={id}
            icon={
              <Avatar
                src={`${import.meta.env.BASE_URL}${gameId}/character/${id}.webp`}
                sx={{
                  width: 48,
                  height: 48,
                  '& .MuiAvatar-img': {
                    objectFit: 'cover',
                    objectPosition: 'top center',
                  },
                }}
              />
            }
            sx={{
              minWidth: 0,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          />
        ))}
      </Tabs>
  );
};
