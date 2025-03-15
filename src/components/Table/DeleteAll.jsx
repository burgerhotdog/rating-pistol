import React, { useState } from "react";
import { writeBatch, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  Backdrop,
  Tooltip,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Delete, Check } from '@mui/icons-material';

const DeleteAll = ({
  gameId,
  userId,
  localDocs,
  setLocalDocs,
  hoveredHead,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openTooltip = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    setIsLoading(true);

    if (userId) {
      const batch = writeBatch(db);
      const localEntries = Object.entries(localDocs);
      localEntries.forEach(([id, _]) => {
        const docRef = doc(db, "users", userId, gameId, id);
        batch.delete(docRef);
      });
      await batch.commit();
    }

    setLocalDocs({});

    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip
        open={open}
        title={
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
          >
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
        arrow
      >
        <Delete
          onClick={openTooltip}
          cursor="pointer"
          color="disabled"
          sx={{
            opacity: open || hoveredHead ? 1 : 0,
            transition: "opacity 0.3s ease, color 0.3s ease",
            "&:hover": { color: "secondary.main" },
          }}
        />
      </Tooltip>

      <Backdrop
        open={open}
        onClick={handleCancel}
        sx={{ zIndex: 1 }}
      />
    </>
  );
};

export default DeleteAll;
