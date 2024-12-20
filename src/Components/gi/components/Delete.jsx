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
      {/* Modal Styles */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#1c1c1c',
        padding: 4,
        borderRadius: 2,
      }}>
        {/* Text section */}
        <Typography variant='body1'>
          Are you sure you want to delete{' '}
          <strong>{myCharacters[newId]?.name ?? null}</strong>
          ?
        </Typography>

        {/* Buttons section */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mt: 2,
        }}>
          <Button
            variant='outlined'
            color='primary'
            onClick={handleCancel}
            sx={{ width: 80 }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='secondary'
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
