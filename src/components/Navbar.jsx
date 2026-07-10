import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';
import { CharAvatar } from '@/components';

export const Navbar = ({ sorted }) => {
  const { gameId, characterId } = useParams();
  const navigate = useNavigate();

  const handleChange = (_, id) => {
    if (characterId === id) return;
    navigate(`/${gameId}/${id}`, { replace: true });
  };

  return (
      <Tabs
        variant="scrollable"
        orientation="vertical"
        value={characterId ?? false}
        onChange={handleChange}
        slotProps={{
          indicator: {
            style: { display: 'none' },
          },
        }}
      >
        {sorted.map((id) => (
          <Tab
            key={id}
            value={id}
            icon={<CharAvatar gameId={gameId} charId={id} />}
            sx={{
              minWidth: 0,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
              },
            }}
          />
        ))}
      </Tabs>
  );
};
