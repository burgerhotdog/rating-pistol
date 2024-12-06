import React from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { Box, Button, Modal, Typography } from '@mui/material';
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
  /* Delete button */
  const handleDelete = async () => {
    try {
      // Delete document from firestore
      const characterDocRef = doc(db, 'users', uid, 'GenshinImpact', newId);
      await deleteDoc(characterDocRef);
      // Delete entry from myCharacters
      setMyCharacters((prevCharacters) => {
        const updatedCharacters = { ...prevCharacters }; // Make copy of myCharacters
        delete updatedCharacters[newId]; // Delete entry from copy
        return updatedCharacters; // Return copy
      });
    } catch (error) {
      // Catch errors
      console.error("handleDelete: ", error);
    } finally {
      // Reset variables
      setNewId('');
      setIsDeleteOpen(false);
    }
  };

  /* Cancel button */
  const handleCancel = () => {
    // Reset variables
    setNewId('');
    setIsDeleteOpen(false);
  };

  return (
    <Modal open={isDeleteOpen} onClose={handleCancel}>
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
        <Typography variant="h6" component="h2">
          Confirm Deletion
        </Typography>
        <Typography sx={{ mt: 2 }}>
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
