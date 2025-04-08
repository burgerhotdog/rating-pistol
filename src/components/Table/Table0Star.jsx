import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@config/firebase";
import { Star, StarBorder } from '@mui/icons-material';

const Table0Star = ({
  gameId,
  userId,
  setLocalDocs,
  id,
  data,
}) => {
  const toggleStar = async () => {
    const newValue = !Boolean(data.isStar);
    
    if (userId) {
      const infoDocRef = doc(db, "users", userId, gameId, id);
      setDoc(infoDocRef, { isStar: newValue }, { merge: true });
    }

    setLocalDocs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isStar: newValue,
      },
    }));
  }

  if (data.isStar) {
    return (
      <Star onClick={toggleStar} cursor="pointer" color="gold" />
    );
  }

  return (
    <StarBorder
      onClick={toggleStar}
      cursor="pointer"
      color="disabled"
      sx={{
        transition: "color 0.3s ease",
        "&:hover": { color: "gold.main" },
      }}
    />
  );
};

export default Table0Star;
