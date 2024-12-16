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
  // Delete button handler
  const handleDelete = async () => {
    try {
      if (uid) {
        // If signed in:
        // Delete document from firestore
        const characterDocRef = doc(db, 'users', uid, 'GenshinImpact', newId);
        await deleteDoc(characterDocRef);
      }

      // Delete object from myCharacters
      setMyCharacters((prevCharacters) => {
        const updatedCharacters = { ...prevCharacters }; // Make copy of myCharacters
        delete updatedCharacters[newId]; // Delete entry from copy
        return updatedCharacters; // Return copy
      });
    } catch (error) {
      console.error("handleDelete: ", error);
    } finally {
      setNewId('');
      setIsDeleteOpen(false);
    }
  };

  // Cancel button handler
  const handleCancel = () => {
    setNewId('');
    setIsDeleteOpen(false);
  };

  return (
    <Modal open={isDeleteOpen} onClose={handleCancel}>
      <Box
        sx={{
          backgroundColor: '#1c1c1c',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          Confirm Deletion
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Are you sure you want to delete {' '}
          {myCharacters[newId] ? (
            <strong>{myCharacters[newId].name}</strong>
          ) : (
            ''
          )}
          ?
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
