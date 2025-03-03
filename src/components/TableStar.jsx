import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { TableCell } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { db } from "../firebase";

const TableStar = ({
  uid,
  gameType,
  setLocalObjs,
  id,
  data,
  hoveredRow,
}) => {
  const toggleStar = async () => {
    const newValue = !Boolean(data.info.isStar);

    if (uid) {
      const infoDocRef = doc(db, "users", uid, gameType, id);
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
    <TableCell align="center">
      {data.info.isStar ? (
        <StarIcon
          onClick={toggleStar}
          sx={{ color: "gold", cursor: "pointer" }}
        />
      ) : hoveredRow === id ? (
        <StarBorderIcon
          onClick={toggleStar}
          sx={{ color: "text.disabled", cursor: "pointer" }}
        />
      ) : null}
    </TableCell>
  );
};

export default TableStar;
