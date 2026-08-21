import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Tab, Tabs } from '@mui/material';
import { useSortedBuilds, useData } from '@/hooks';

const Navbar = () => {
  const { gameId, charId } = useParams();
  const { sortedKeys } = useSortedBuilds();
  const characterData = useData('character');

  const navigate = useNavigate();

  return (
    <Tabs
      variant="scrollable"
      orientation="vertical"
      value={charId}
      onChange={(_, value) => value !== charId &&
        navigate(`/${gameId}/${value}`, { replace: true })
      }
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
          icon={(
            <Avatar
              variant="rounded"
              src={characterData[id].icon}
              alt={characterData[id].name}
              slotProps={{
                img: {
                  style: {
                    objectFit: 'cover',
                    objectPosition: 'top center',
                  },
                },
              }}
            />
          )}
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
