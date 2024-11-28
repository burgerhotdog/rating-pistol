import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import BackToMenu from '../Components/BackToMenu';

const GI = () => {
  const [characters, setCharacters] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    constellation: 'c0',
    weapon: '',
    refinement: 'r1',
  });
  const [editIndex, setEditIndex] = useState(null); // Track index for editing

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCharacter({ ...newCharacter, [name]: value });
  };

  const handleSaveCharacter = () => {
    if (editIndex !== null) {
      // Update existing character
      const updatedCharacters = [...characters];
      updatedCharacters[editIndex] = newCharacter;
      setCharacters(updatedCharacters);
      setEditIndex(null);
    } else {
      // Add new character
      setCharacters([...characters, newCharacter]);
    }
    setNewCharacter({
      name: '',
      constellation: 'c0',
      weapon: '',
      refinement: 'r1',
    });
    setOpenModal(false);
  };

  const handleEditCharacter = (index) => {
    setEditIndex(index);
    setNewCharacter(characters[index]);
    setOpenModal(true);
  };

  const handleDeleteCharacter = (index) => {
    const updatedCharacters = characters.filter((_, i) => i !== index);
    setCharacters(updatedCharacters);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={{
        textAlign: 'center',
        padding: 2,
        backgroundColor: '#242424', // Dark background color
        color: '#e0e0e0', // Softer white text color
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif', // Custom font
      }}
    >
      <Typography variant="h4" gutterBottom>
        Genshin Impact
      </Typography>
      <BackToMenu />

      {/* Character Table */}
      <TableContainer sx={{ maxWidth: 800, mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#e0e0e0' }}>Name</TableCell>
              <TableCell sx={{ color: '#e0e0e0' }}>Constellation</TableCell>
              <TableCell sx={{ color: '#e0e0e0' }}>Weapon</TableCell>
              <TableCell sx={{ color: '#e0e0e0' }}>Refinement</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {characters.map((character, index) => (
              <TableRow key={index}>
                <TableCell sx={{ color: '#e0e0e0' }}>{character.name}</TableCell>
                <TableCell sx={{ color: '#e0e0e0' }}>{character.constellation}</TableCell>
                <TableCell sx={{ color: '#e0e0e0' }}>{character.weapon}</TableCell>
                <TableCell sx={{ color: '#e0e0e0' }}>{character.refinement}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditCharacter(index)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteCharacter(index)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Character Button */}
      <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
        Add Character
      </Button>

      {/* Modal for Adding/Editing Characters */}
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditIndex(null);
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
            width: 400,
            bgcolor: '#242424', // Dark background color for modal
            color: '#e0e0e0', // Softer white text color for modal
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
              '& .MuiOutlinedInput-root': { 
                backgroundColor: '#3b3b3b', // Opaque background for input field
                borderColor: '#646cff' // Light border color
              },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#646cff' }, // Border color
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
              color: '#e0e0e0', // Softer text color in Select field
              backgroundColor: '#3b3b3b', // Opaque background for Select field
              '& .MuiOutlinedInput-root': { borderColor: '#646cff' }, // Outline border color
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
              '& .MuiOutlinedInput-root': { 
                backgroundColor: '#3b3b3b', // Opaque background for input field
                borderColor: '#646cff' // Light border color
              },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#646cff' }, // Border color
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
              backgroundColor: '#3b3b3b', // Opaque background for Select field
              '& .MuiOutlinedInput-root': { borderColor: '#646cff' }, // Outline border color
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
                setEditIndex(null);
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
    </Box>
  );
};

export default GI;
