import React from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { Box, Button, Modal, Typography } from "@mui/material";
import { db } from "../firebase";

const Delete = ({
  gameType,
  uid,
  isDeleteOpen,
  setIsDeleteOpen,
  setMyChars,
}) => {
  const handleDelete = async () => {
    try {
      // If signed in, delete document from firestore
      if (uid) {
        const characterDocRef = doc(db, "users", uid, gameType, isDeleteOpen);
        await deleteDoc(characterDocRef);
      }

      // Delete object from myChars
      setMyChars((prev) => {
        const updatedChars = { ...prev };
        delete updatedChars[isDeleteOpen];
        return updatedChars;
      });
    } catch (error) {
      console.error("handleDelete: ", error);
    } finally {
      setIsDeleteOpen(false);
    }
  };

  const handleCancel = () => {
    setIsDeleteOpen(false);
  };

  return (
    <Modal open={Boolean(isDeleteOpen)} onClose={handleCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "background.paper",
          padding: 4,
          borderRadius: 2,
        }}
      >
        {/* Text section */}
        <Typography variant="body1">
          Are you sure you want to delete{" "}
          <strong>{isDeleteOpen}</strong>
          ?
        </Typography>

        {/* Buttons section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mt: 2,
          }}
        >
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
        </Box>
      </Box>
    </Modal>
  );
};

export default Delete;
