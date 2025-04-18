import React, { useState } from "react";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "@config/firebase";
import {
  Backdrop,
  Tooltip,
  Stack,
  Typography,
  CircularProgress,
  TableCell,
} from "@mui/material";
import { Delete, Check } from "@mui/icons-material";

const DeleteHead = ({ gameId, userId, avatarCache, setAvatarCache }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    if (userId) {
      const batch = writeBatch(db);
      Object.keys(avatarCache).forEach((id) => {
        const docRef = doc(db, "users", userId, gameId, id);
        batch.delete(docRef);
      });
      await batch.commit();
    }
    setAvatarCache({});
    setOpen(false);
    setIsLoading(false);
  };

  return (
    <TableCell width={50}>
      <Tooltip
        open={open}
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="tooltip">
              Delete All?
            </Typography>

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
      >
        <Delete
          onClick={() => setOpen(true)}
          cursor="pointer"
          color="disabled"
          sx={{
            transition: "color 0.3s ease",
            "&:hover": { color: "secondary.main" },
          }}
        />
      </Tooltip>

      <Backdrop
        open={open}
        onClick={() => setOpen(false)}
        sx={{ zIndex: 1 }}
      />
    </TableCell>
  );
};

export default DeleteHead;
