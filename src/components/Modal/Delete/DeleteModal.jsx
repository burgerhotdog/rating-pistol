import React, { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import {
  Stack,
  Button,
  Typography,
} from "@mui/material";
import getData from "../../getData";

const DeleteModal = ({
  gameId,
  userId,
  action,
  setAction,
  setLocalDocs,
}) => {
  const { avatarData } = getData(gameId);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDelete = async () => {
    setIsLoading(true);
    if (userId) {
      const docRef = doc(db, "users", userId, gameId, action.id);
      await deleteDoc(docRef);
    }

    setLocalDocs((prev) => {
      const newDocs = { ...prev };
      delete newDocs[action.id];
      return newDocs;
    });

    setIsLoading(false);
    setAction({});
  };

  const handleCancel = () => {
    setAction({});
  };

  return (
    <Stack spacing={2}>
      <Typography variant="body1">
        Are you sure you want to delete{" "}
        <strong>{avatarData[action.id]?.name}</strong>?
      </Typography>
      <Stack direction="row" justifyContent="center" spacing={2}>
        <Button
          onClick={handleCancel}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          loading={isLoading}
          variant="contained"
          color="secondary"
        >
          Delete
        </Button>
      </Stack>
    </Stack>
  );
};

export default DeleteModal;
