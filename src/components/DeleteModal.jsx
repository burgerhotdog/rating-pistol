import React from "react";
import { writeBatch, doc, deleteDoc } from "firebase/firestore";
import { Box, Button, Modal, Stack, Typography, useTheme } from "@mui/material";
import { db } from "../firebase";

const DeleteModal = ({
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
    try {
      if (uid) {
        const batch = writeBatch(db);
        for (const [index, gearObj] of gearList.entries()) {
          const gearDocRef = doc(db, "users", uid, gameType, action.id, "gearList", index.toString());
          batch.delete(gearDocRef);
        }
        const infoDocRef = doc(db, "users", uid, gameType, action.id);
        batch.delete(infoDocRef);
        await batch.commit();
      }

      setLocalObjs((prev) => {
        const updatedCollection = { ...prev };
        delete updatedCollection[action.id];
        return updatedCollection;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setAction({});
    }
  };

  const handleCancel = () => {
    setAction({});
  };

  return (
    <Modal open={action?.type === "delete"} onClose={handleCancel}>
      <Box sx={theme.customStyles.modal}>
        <Stack gap={2}>
          <Typography variant="body1">
            Are you sure you want to delete{" "}
            <strong>{CHAR[action.id]?.name}</strong>
            ?
          </Typography>

          {/* Buttons */}
          <Stack direction="row" justifyContent="center" gap={2}>
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

export default DeleteModal;
