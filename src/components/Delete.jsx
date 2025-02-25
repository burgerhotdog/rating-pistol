import React, { useEffect, useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { Box, Button, Modal, Typography } from "@mui/material";
import { db } from "../firebase";
import dataTemplate from "./dataTemplate";

const Delete = ({
  uid,
  gameType,
  gameData,
  deleteEntry,
  setDeleteEntry,
  setMyChars,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { CHAR } = gameData;

  useEffect(() => {
    setIsModalOpen(!!deleteEntry.id);
  }, [deleteEntry]);
  
  const handleDelete = async () => {
    try {
      // Firestore
      if (uid) {
        const docRef = doc(db, "users", uid, gameType, deleteEntry.id);
        await deleteDoc(docRef);
      }

      // Local
      setMyChars((prev) => {
        const updatedChars = { ...prev };
        delete updatedChars[deleteEntry.id];
        return updatedChars;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteEntry({ id: "", data: dataTemplate(gameType) });
    }
  };

  const handleCancel = () => {
    setDeleteEntry({ id: "", data: dataTemplate(gameType) });
  };

  return (
    <Modal open={isModalOpen} onClose={handleCancel}>
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
        <Typography variant="body1">
          Are you sure you want to delete{" "}
          <strong>{CHAR[deleteEntry.id]?.name}</strong>
          ?
        </Typography>

        {/* Buttons */}
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
