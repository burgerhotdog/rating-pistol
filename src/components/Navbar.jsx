import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Tab, Tabs } from '@mui/material';
import { useSortedBuilds, useData } from '@/hooks';

const Navbar = () => {
  const { gameId, charId } = useParams();
  const { sortedKeys } = useSortedBuilds();
  const charDatas = useData('character');

  const navigate = useNavigate();

  return (
    <Tabs
      variant="scrollable"
      orientation="vertical"
      value={charId}
      onChange={(_, value) => {
        if (value !== charId) {
          navigate(`/${gameId}/${value}`, { replace: true });
        }
      }}
      slotProps={{ indicator: { style: { display: 'none' } } }}
    >
      {sortedKeys.map((id) => {
        const { name, icon } = charDatas[id];
        return (
          <Tab
            key={id}
            value={id}
            icon={<Avatar src={icon} alt={name} />}
            sx={{
              minWidth: 0,
              '&:hover': { backgroundColor: 'action.hover' },
              '&.Mui-selected': { backgroundColor: 'action.selected' },
            }}
          />
        );
      })}
    </Tabs>
  );
};

export default Navbar;
