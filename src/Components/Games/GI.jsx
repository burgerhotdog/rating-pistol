import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { auth, db } from '../../firebase';
import BackToMenu from '../BackToMenu';
import GIAddEdit from './GIAddEdit';
import GIDelete from './GIDelete';
import GIChar from './GIChar';

const GI = ({ uid }) => {
  // modal and index states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // character data
  const [myChars, setMyChars] = useState([]);
  const [newChar, setNewChar] = useState(GIChar);

  // load myChars on auth change
  useEffect(() => {
    const fetchDB = async () => {
      if (!uid) {
        setMyChars([]);
      }

      const colGI = db.collection('users').doc(uid).collection('genshin_impact');
      const charDocs = await colGI.get();

      const characters = await Promise.all(
        charDocs.docs.map(async (charDoc) => {
          const charData = charDoc.data();
          const colArti = colGI.doc(charDoc.id).collection('artifacts');
          const artiDocs = await colArti.get();

          // Collect artifact data
          const artifacts = {};
          artiDocs.forEach((artiDoc) => {
            artifacts[artiDoc.id] = artiDoc.data();
          });

          // Return character data with artifacts
          return { id: charDoc.id, ...charData, artifacts };
        })
      )

      setMyChars(characters);
    };
    fetchDB();
  }, [uid]);

  // button handlers
  const handleAddChar = () => {
    setEditIndex(null);
    setNewChar(GIChar());
    setIsAddEditOpen(true);
  };

  const handleEditChar = (index) => {
    setEditIndex(index);
    setNewChar(myChars[index]);
    setIsAddEditOpen(true);
  };

  const handleDeleteChar = (index) => {
    setDeleteIndex(index);
    setIsDeleteOpen(true);
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
                  <TableCell>{char.id}</TableCell>
                  <TableCell>{char.constellation}</TableCell>
                  <TableCell>{char.weapon}</TableCell>
                  <TableCell>{char.weaponRefinement}</TableCell>
                  <TableCell>
                    {/* button to edit character */}
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditChar(index)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    {/* button to delete character */}
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

      {/* button to add character */}
      <Button variant="contained" color="primary" onClick={handleAddChar}>
        Add Character
      </Button>

      {/* modal to add or edit character */}
      <GIAddEdit
        isAddEditOpen={isAddEditOpen}
        setIsAddEditOpen={setIsAddEditOpen}
        editIndex={editIndex}
        setEditIndex={setEditIndex}
        myChars={myChars}
        setMyChars={setMyChars}
        newChar={newChar}
        setNewChar={setNewChar}
      />

      {/* modal to delete character */}
      <GIDelete
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        deleteIndex={deleteIndex}
        setDeleteIndex={setDeleteIndex}
      />
    </Box>
  );
};

export default GI;
