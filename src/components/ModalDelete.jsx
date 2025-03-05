import React from "react";
import { doc, writeBatch } from "firebase/firestore";
import { Modal, Box, Stack, Button, Typography, useTheme } from "@mui/material";
import { db } from "../firebase";

const ModalDelete = ({
  uid,
  gameType,
  gameData,
  action,
  setAction,
  setLocalObjs,
}) => {
  const theme = useTheme();
  const { CHAR } = gameData;
  
  const handleDelete = async () => {
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
            <strong>{CHAR[action.id]?.name}</strong>
            ?
          </Typography>

          <Stack direction="row" justifyContent="center" spacing={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCancel}
              sx={{ width: 80 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
              sx={{ width: 80 }}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModalDelete;
