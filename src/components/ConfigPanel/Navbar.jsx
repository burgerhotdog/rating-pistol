import { useNavigate, useParams } from 'react-router-dom';
import { Tab, Tabs } from '@mui/material';
import { CharAvatar } from '@/components';
import { useSortedBuilds } from '@/hooks';

const Navbar = () => {
  const { gameId, charId } = useParams();
  const { sortedKeys } = useSortedBuilds(gameId);
  const navigate = useNavigate();

  const handleTabs = (_, id) => {
    if (charId === id) return;
    navigate(`/${gameId}/${id}`, { replace: true });
  };

  return (
    <Tabs
      variant="scrollable"
      orientation="vertical"
      value={charId ?? false}
      onChange={handleTabs}
      slotProps={{
        indicator: {
          style: { display: 'none' },
        },
      }}
    >
      {sortedKeys.map((id) => (
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

export default Navbar;
