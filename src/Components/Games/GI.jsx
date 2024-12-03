import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import BackToMenu from '../BackToMenu';
import GIAdd from './GIAdd';
import GIDelete from './GIDelete';

const GI = () => {
  // modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(state => !state);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const toggleDelete = () => setIsDeleteOpen(state => !state);

  // my characters data
  const [myChars, setMyChars] = useState([]);
  const [newChar, setNewChar] = useState({
    name: '(select)',
    constellation: 'c0',
    weapon: '(select)',
    refinement: 'r1',
  });

  // track index for edit and delete
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

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
      name: '(select)',
      constellation: 'c0',
      weapon: '(select)',
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

  // open confirmation dialog after using delete button
  const handleDeleteChar = (index) => {
    setDeleteIndex(index);
    toggleDelete();
  };

  // confirm delete
  const handleConfirmDelete = () => {
    const updatedChars = myChars.filter((_, i) => i !== deleteIndex);
    setMyChars(updatedChars);
    toggleDelete();
    setDeleteIndex(null);
  };

  // cancel delete
  const handleCancelDelete = () => {
    toggleDelete();
    setDeleteIndex(null);
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
            {myChars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No characters to display
                </TableCell>
              </TableRow>
            ) : (
              myChars.map((char, index) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add character button */}
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Add Character
      </Button>

      {/* modal for adding/editing characters */}
      <GIAdd
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        newChar={newChar}
        setNewChar={setNewChar}
        handleInputChange={handleInputChange}
        handleSaveChar={handleSaveChar}
        editIndex={editIndex}
      />

      {/* Confirmation Dialog */}
      <GIDelete
        isDeleteOpen={isDeleteOpen}
        toggleDelete={toggleDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </Box>
  );
};

export default GI;
