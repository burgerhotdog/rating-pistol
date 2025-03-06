import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { Stack } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { db } from "../../firebase";

const TableStar = ({
  user,
  gameType,
  setLocalObjs,
  id,
  data,
}) => {
  const toggleStar = async () => {
    const newValue = !Boolean(data.info.isStar);

    if (user) {
      const infoDocRef = doc(db, "users", user.uid, gameType, id);
      await setDoc(infoDocRef, { isStar: newValue }, { merge: true });
    }

    setLocalObjs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        info: {
          ...prev[id].info,
          isStar: newValue,
        },
      }
    }));
  }

  return (
    <Stack alignItems="center">
      {data.info.isStar ? (
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
