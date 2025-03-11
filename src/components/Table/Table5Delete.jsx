import React, { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Delete, Check } from '@mui/icons-material';
import { Popover, Stack, Typography, CircularProgress } from "@mui/material";
import getData from "../getData";

const Table5Delete = ({
  gameId,
  userId,
  id,
  setLocalDocs,
  hoveredId,
}) => {
  const { avatarData } = getData[gameId];
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const openPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

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

    closePopover();
  };

  return (
    <>
      <Delete
        onClick={openPopover}
        cursor="pointer"
        color="disabled"
        sx={{
          opacity: (Boolean(anchorEl) || hoveredId === id) ? 1 : 0,
          transition: "opacity 0.3s ease, color 0.3s ease",
          "&:hover": { color: "secondary.main" },
        }}
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          p={1}
        >
          <Typography variant="body2">
            Delete {avatarData[id]?.name}?
          </Typography>
          
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <Check
              onClick={handleDelete}
              cursor="pointer"
              sx={{
                "&:hover": { color: "secondary.main" },
              }}
            />
          )}
        </Stack>
      </Popover>
    </>
  );
};

export default Table5Delete;
