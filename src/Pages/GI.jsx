// src/Pages/GI.js

import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import BackToMenu from '../Components/BackToMenu';
import CharacterModal from './CharacterModal';

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
      <CharacterModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        newCharacter={newCharacter}
        setNewCharacter={setNewCharacter}
        handleInputChange={handleInputChange}
        handleSaveCharacter={handleSaveCharacter}
        editIndex={editIndex}
      />
    </Box>
  );
};

export default GI;
