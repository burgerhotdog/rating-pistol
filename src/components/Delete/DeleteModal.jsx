import React, { useState } from "react";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase";
import {
  Modal,
  Box,
  Stack,
  Button,
  Typography,
  useTheme
} from "@mui/material";
import getData from "../getData";

const DeleteModal = ({
  uid,
  gameType,
  action,
  setAction,
  setLocalObjs,
}) => {
  const theme = useTheme();
  const { CHARACTERS } = getData(gameType);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDelete = async () => {
    setIsLoading(true);
    
    if (uid) {
      const batch = writeBatch(db);
      for (const index of action.data.gearList.keys()) {
        const gearDocRef = doc(db, "users", uid, gameType, action.id, "gearList", index.toString());
        batch.delete(gearDocRef);
      }
      const infoDocRef = doc(db, "users", uid, gameType, action.id);
      batch.delete(infoDocRef);
      await batch.commit();
    }

    setLocalObjs((prev) => {
      const newObjs = { ...prev };
      delete newObjs[action.id];
      return newObjs;
    });

    setIsLoading(false);
    setAction({});
  };

  const handleCancel = () => {
    setAction({});
  };

  return (
    <Modal open={action?.type === "delete"} onClose={handleCancel}>
      <Box sx={theme.customStyles.modal}>
        <Stack spacing={2}>
          <Typography variant="body1">
            Are you sure you want to delete{" "}
            <strong>{CHARACTERS[action.id]?.name}</strong>?
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
      </Box>
    </Modal>
  );
};

export default DeleteModal;
