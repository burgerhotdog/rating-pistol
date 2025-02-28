import React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { Box, Button, Modal, Stack, Typography, useTheme } from "@mui/material";
import { db } from "../firebase";
import dataTemplate from "./dataTemplate";

const DeleteModal = ({
  uid,
  gameType,
  gameData,
  action,
  setAction,
  setMyChars,
}) => {
  const theme = useTheme();
  const { CHAR } = gameData;
  
  const handleDelete = async () => {
    try {
      // Firestore
      if (uid) {
        const docRef = doc(db, "users", uid, gameType, action.id);
        await deleteDoc(docRef);
      }

      // Local
      setMyChars((prev) => {
        const updatedChars = { ...prev };
        delete updatedChars[action.id];
        return updatedChars;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setAction({ e: "", id: "", data: dataTemplate(gameType) });
    }
  };

  const handleCancel = () => {
    setAction({ e: "", id: "", data: dataTemplate(gameType) });
  };

  return (
    <Modal open={action?.e === "delete"} onClose={handleCancel}>
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
