import React, { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  Backdrop,
  Tooltip,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Delete, Check } from '@mui/icons-material';

const Table5Delete = ({
  gameId,
  userId,
  id,
  setLocalDocs,
  hoveredId,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    if (userId) {
      const docRef = doc(db, "users", userId, gameId, id);
      await deleteDoc(docRef);
    }
    setLocalDocs((prev) => {
      const newDocs = { ...prev };
      delete newDocs[id];
      return newDocs;
    });
    setOpen(false);
  };

  return (
    <>
      <Tooltip
        open={open}
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="tooltip">Delete?</Typography>

            {isLoading ? (
              <CircularProgress size={16} />
            ) : (
              <Check
                onClick={handleDelete}
                cursor="pointer"
                sx={{
                  fontSize: 16,
                  "&:hover": { color: "secondary.main" },
                }}
              />
            )}
          </Stack>
        }
        arrow
      >
        <Delete
          onClick={() => setOpen(true)}
          cursor="pointer"
          color="disabled"
          sx={{
            opacity: open || hoveredId === id ? 1 : 0,
            transition: "opacity 0.3s ease, color 0.3s ease",
            "&:hover": { color: "secondary.main" },
          }}
        />
      </Tooltip>

      <Backdrop
        open={open}
        onClick={() => setOpen(false)}
        sx={{ zIndex: 1 }}
      />
    </>
  );
};

export default Table5Delete;
