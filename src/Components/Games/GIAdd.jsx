import React from 'react';
import { Box, Typography, Select, MenuItem, Button, Modal } from '@mui/material';

const GIAdd = ({
  isModalOpen,
  toggleModal,
  newChar,
  setNewChar,
  handleInputChange,
  handleSaveChar,
  editIndex,
}) => {
  return (
    <Modal
      open={isModalOpen}
      onClose={toggleModal}
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

        <Typography variant="body1" sx={{ mt: 2 }}>
          Name
        </Typography>
        <Select
          fullWidth
          name="name"
          value={newChar.name}
          onChange={handleInputChange}
        >
          {['(select)', 'character1', 'character2'].map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Constellation
        </Typography>
        <Select
          fullWidth
          name="constellation"
          value={newChar.constellation}
          onChange={handleInputChange}
        >
          {['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6'].map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Weapon
        </Typography>
        <Select
          fullWidth
          name="weapon"
          value={newChar.weapon}
          onChange={handleInputChange}
        >
          {['(select)', 'weapon1', 'weapon2'].map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Refinement
        </Typography>
        <Select
          fullWidth
          name="refinement"
          value={newChar.refinement}
          onChange={handleInputChange}
        >
          {['r1', 'r2', 'r3', 'r4', 'r5'].map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>

        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button variant="outlined" color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSaveChar}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default GIAdd;
