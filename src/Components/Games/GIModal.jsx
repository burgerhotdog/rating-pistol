import React from 'react';
import { Box, Typography, TextField, Select, MenuItem, Button, Modal } from '@mui/material';

const GIModal = ({
  openModal,
  setOpenModal,
  newCharacter,
  setNewCharacter,
  handleInputChange,
  handleSaveCharacter,
  editIndex,
}) => {
  return (
    <Modal
      open={openModal}
      onClose={() => {
        setOpenModal(false);
      }}
      aria-labelledby="add-character-modal"
      aria-describedby="add-character-modal-description"
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
        <Typography variant="h6" gutterBottom>
          {editIndex !== null ? 'Edit Character' : 'Add New Character'}
        </Typography>

        <TextField
          fullWidth
          label="Name"
          name="name"
          value={newCharacter.name}
          onChange={handleInputChange}
          margin="normal"
          sx={{
            input: { color: '#e0e0e0' }, // Softer text color in input field
            '& .MuiInputLabel-root': { color: '#e0e0e0' }, // Softer label color
            '& .MuiOutlinedInput-root': { backgroundColor: '#3b3b3b' }
          }}
        />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Constellation
        </Typography>
        <Select
          fullWidth
          name="constellation"
          value={newCharacter.constellation}
          onChange={handleInputChange}
          sx={{
            mb: 2,
            backgroundColor: '#3b3b3b', // Opaque background for Select field
          }}
        >
          {['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6'].map((level) => (
            <MenuItem key={level} value={level}>
              {level.toUpperCase()}
            </MenuItem>
          ))}
        </Select>

        <TextField
          fullWidth
          label="Weapon"
          name="weapon"
          value={newCharacter.weapon}
          onChange={handleInputChange}
          margin="normal"
          sx={{
            input: { color: '#e0e0e0' }, // Softer text color in input field
            '& .MuiInputLabel-root': { color: '#e0e0e0' }, // Softer label color
            '& .MuiOutlinedInput-root': { backgroundColor: '#3b3b3b' }
          }}
        />

        <Typography variant="body1" sx={{ mt: 2 }}>
          Refinement
        </Typography>
        <Select
          fullWidth
          name="refinement"
          value={newCharacter.refinement}
          onChange={handleInputChange}
          sx={{
            mb: 2,
            color: '#e0e0e0', // Softer text color in Select field
            backgroundColor: '#3b3b3b'
          }}
        >
          {['r1', 'r2', 'r3', 'r4', 'r5'].map((level) => (
            <MenuItem key={level} value={level}>
              {level.toUpperCase()}
            </MenuItem>
          ))}
        </Select>

        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSaveCharacter}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default GIModal;
