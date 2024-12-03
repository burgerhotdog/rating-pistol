import React from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';

const GIDelete = ({
  isDeleteOpen,
  setIsDeleteOpen,
  deleteIndex,
  setDeleteIndex,
}) => {
  // delete
  const handleConfirmDelete = () => {
    const updatedChars = myChars.filter((_, i) => i !== deleteIndex);
    setMyChars(updatedChars);
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
      aria-labelledby="delete-character-modal"
      aria-describedby="delete-character-modal-description"
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
