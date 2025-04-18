import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@config/firebase";
import TableCell from "@mui/material/TableCell";
import { Star, StarBorder } from '@mui/icons-material';

const StarCell = ({
  gameId,
  userId,
  setAvatarCache,
  id,
  data,
}) => {
  const toggleStar = async () => {
    const newValue = !Boolean(data.isStar);
    
    if (userId) {
      const infoDocRef = doc(db, "users", userId, gameId, id);
      setDoc(infoDocRef, { isStar: newValue }, { merge: true });
    }

    setAvatarCache((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        data: {
          ...prev[id].data,
          isStar: newValue,
        },
      },
    }));
  }

  if (data.isStar) {
    return (
      <TableCell width={50}>
        <Star 
          onClick={toggleStar} 
          cursor="pointer" 
          color="gold" 
        />
      </TableCell>
    );
  }

  return (
    <TableCell width={50}>
      <StarBorder
        onClick={toggleStar}
        cursor="pointer"
        color="disabled"
        sx={{
          transition: "color 0.3s ease",
          "&:hover": {
            color: "gold.main",
          },
        }}
      />
    </TableCell>
  );
};

export default StarCell;
