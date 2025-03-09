import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Stack } from "@mui/material";
import { Star, StarBorder } from '@mui/icons-material';

const TableStar = ({
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
      await setDoc(infoDocRef, { isStar: newValue }, { merge: true });
    }

    setLocalDocs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isStar: newValue,
      },
    }));
  }

  return (
    data.isStar ? (
      <Star
        onClick={toggleStar}
        cursor="pointer"
        color="gold"
      />
    ) : (
      <StarBorder
        onClick={toggleStar}
        cursor="pointer"
        color="disabled"
        sx={{
          transition: "color 0.3s ease",
          "&:hover": { color: "gold.main" },
        }}
      />
    )
  );
};

export default TableStar;
