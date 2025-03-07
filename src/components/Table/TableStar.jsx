import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { Stack } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { db } from "../../firebase";

const TableStar = ({
  userId,
  gameId,
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
    <Stack alignItems="center">
      {data.isStar ? (
        <StarIcon
          onClick={toggleStar}
          cursor="pointer"
          color="gold"
        />
      ) : (
        <StarBorderIcon
          onClick={toggleStar}
          cursor="pointer"
          color="disabled"
          sx={{
            transition: "color 0.3s ease",
            "&:hover": { color: "gold.main" },
          }}
        />
      )}
    </Stack>
  );
};

export default TableStar;
