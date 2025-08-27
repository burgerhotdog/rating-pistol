import { doc, setDoc } from 'firebase/firestore';
import { db } from '@config/firebase';
import { TableCell, IconButton } from '@mui/material';
import { Star, StarOutline } from '@mui/icons-material';

const StarCell = ({ gameId, userId, setAvatarCache, id, data }) => {
  const { isStar } = data;

  const toggleStar = async () => {
    if (userId) {
      const infoDocRef = doc(db, 'users', userId, gameId, id);
      setDoc(infoDocRef, { isStar: !Boolean(isStar) }, { merge: true });
    }

    setAvatarCache((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        data: {
          ...prev[id].data,
          isStar: !Boolean(isStar),
        },
      },
    }));
  }

  return (
    <TableCell>
      <IconButton size="small" onClick={toggleStar}>
        {isStar ? (
          <Star color="warning" />
        ) : (
          <StarOutline color="disabled" />
        )}
      </IconButton>
    </TableCell>
  );
};

export default StarCell;
