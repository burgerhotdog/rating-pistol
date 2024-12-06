import React from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import {
  Box,
  Button,
  Modal,
  Typography
} from '@mui/material';
import { db } from '../../../firebase';

const Delete = ({
  uid,
  isDeleteOpen,
  setIsDeleteOpen,
  myCharacters,
  setMyCharacters,
  newId,
  setNewId,
}) => {
  // Delete button
  const handleDelete = async () => {
    try {
      // Delete document from firestore
      const characterDocRef = doc(db, 'users', uid, 'GenshinImpact', newId);
      await deleteDoc(characterDocRef);
  
      // Delete entry from local object by creating a new copy
      setMyCharacters((prevCharacters) => {
        const updatedCharacters = { ...prevCharacters };  // Copy the existing characters
        delete updatedCharacters[newId];  // Delete the specific character by ID
        return updatedCharacters;  // Return the updated object to trigger a re-render
      });
    } catch (error) {
      console.error("handleConfirmDelete: ", error);
    } finally {
      // Reset id and close modal
      setNewId('');
      setIsDeleteOpen(false);
    }
  };

  // Cancel button
  const handleCancel = () => {
    // Reset id and close modal
    setNewId('');
    setIsDeleteOpen(false);
  };

  return (
    <Modal
      open={isDeleteOpen}
      onClose={handleCancel}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#242424',
          width: 400,
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="delete-modal-title" variant="h6" component="h2">
          Confirm Deletion
        </Typography>
        <Typography id="delete-modal-description" sx={{ mt: 2 }}>
          Are you sure you want to delete this character?
        </Typography>

        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button variant="outlined" color="primary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default Delete;
