import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { TableCell } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { db } from "../firebase";

const TableStar = ({
  uid,
  gameType,
  localObjs,
  setLocalObjs,
  id,
  info,
  hoveredRow,
}) => {
  const handleStar = async () => {
    const newValue = !Boolean(localObjs[id]?.info?.isStar);

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
      {info.isStar ? (
        <StarIcon
          onClick={() => handleStar()}
          sx={{ color: "gold", cursor: "pointer" }}
        />
      ) : (
        hoveredRow === id &&
          <StarBorderIcon
            onClick={() => handleStar()}
            sx={{ color: "text.disabled", cursor: "pointer" }}
          />
      )}
    </TableCell>
  );
};

export default TableStar;
