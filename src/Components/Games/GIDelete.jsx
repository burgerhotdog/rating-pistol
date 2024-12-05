import React from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const GIDelete = ({
  uid,
  isDeleteOpen,
  setIsDeleteOpen,
  deleteIndex,
  setDeleteIndex,
  myChars,
  setMyChars,
}) => {
  // delete
  const handleConfirmDelete = async () => {
    const charToDelete = myChars[deleteIndex];
    const updatedChars = myChars.filter((_, i) => i !== deleteIndex);
    setMyChars(updatedChars);
    const charDocRef = doc(db, 'users', uid, 'GenshinImpact', charToDelete.id);
    await deleteDoc(charDocRef);
    setDeleteIndex(null);
    setIsDeleteOpen(false);
  };

  // cancel
  const handleCancelDelete = () => {
    setDeleteIndex(null);
    setIsDeleteOpen(false);
  };

  return (
    <Modal
      open={isDeleteOpen}
      onClose={handleCancelDelete}
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
          <Button variant="outlined" color="primary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default GIDelete;
