import { firebaseAddStar, firebaseDelStar } from '@/firebase';
import { TableCell, IconButton } from '@mui/material';
import { Star, StarOutline } from '@mui/icons-material';

const StarCell = ({ gameId, userId, id, starred, setStarred }) => {
  const toggleStar = () => {
    if (starred.includes(id)) {
      if (userId) firebaseDelStar(userId, gameId, id);
      setStarred(prev => prev.filter(item => item !== id));
    } else {
      if (userId) firebaseAddStar(userId, gameId, id);
      setStarred(prev => [...prev, id]);
    }
  };

  return (
    <TableCell>
      <IconButton size="small" onClick={toggleStar}>
        {starred.includes(id) ? (
          <Star color="warning" />
        ) : (
          <StarOutline color="disabled" />
        )}
      </IconButton>
    </TableCell>
  );
};

export default StarCell;
