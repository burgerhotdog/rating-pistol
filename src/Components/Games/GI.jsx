import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import BackToMenu from '../BackToMenu';
import GIModal from './GIModal';

const GI = () => {
  // modal state
  const [isModal, setIsModal] = useState(false);
  const toggleModal = () => setIsModal(prev => !prev);

  // characters data
  const [myChars, setMyChars] = useState([]);
  const [newChar, setNewChar] = useState({
    name: '(select)',
    constellation: 'c0',
    weapon: '(select)',
    refinement: 'r1',
  });
  const [editIndex, setEditIndex] = useState(null); // Track index for editing

  // on form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChar({ ...newChar, [name]: value });
  };

  // save button
  const handleSaveChar = () => {
    if (editIndex !== null) {
      // edit existing character
      const updatedChars = [...myChars];
      updatedChars[editIndex] = newChar;
      setMyChars(updatedChars);
      setEditIndex(null);
    } else {
      // add new character
      setMyChars([...myChars, newChar]);
    }

    // reset states
    setNewChar({
      name: '',
      constellation: 'c0',
      weapon: '',
      refinement: 'r1',
    });
    toggleModal();
  };

  // edit button
  const handleEditChar = (index) => {
    setEditIndex(index);
    setNewChar(myChars[index]);
    toggleModal();
  };

  // cancel button
  const handleDeleteChar = (index) => {
    const updatedChars = myChars.filter((_, i) => i !== index);
    setMyChars(updatedChars);
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
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
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
              <TableCell>Name</TableCell>
              <TableCell>Constellation</TableCell>
              <TableCell>Weapon</TableCell>
              <TableCell>Refinement</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myChars.map((char, index) => (
              <TableRow key={index}>
                <TableCell>{char.name}</TableCell>
                <TableCell>{char.constellation}</TableCell>
                <TableCell>{char.weapon}</TableCell>
                <TableCell>{char.refinement}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditChar(index)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteChar(index)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* add character button */}
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Add Character
      </Button>

      {/* modal for adding/editing characters */}
      <GIModal
        isModal={isModal}
        toggleModal={toggleModal}
        newChar={newChar}
        setNewChar={setNewChar}
        handleInputChange={handleInputChange}
        handleSaveChar={handleSaveChar}
        editIndex={editIndex}
      />
    </Box>
  );
};

export default GI;
