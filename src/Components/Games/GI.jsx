import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from '../../firebase';
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
      // blank table if not signed in
      if (!uid) {
        setMyChars([]);
        return;
      }

      // pull genshin collection
      const dbGICollection = collection(db, 'users', uid, 'GenshinImpact');
      const dbCharDocs = await getDocs(dbGICollection);

      // pull data for each char
      const dbCharacters = await Promise.all(
        dbCharDocs.docs.map(async (charDoc) => {
          const charData = charDoc.data();
          const dbArtiCollection = collection(db, 'users', uid, 'GenshinImpact', charDoc.id, 'artifacts');
          const dbArtiDocs = await getDocs(dbArtiCollection);

          // pull data for each artifact
          const dbArtifacts = {};
          dbArtiDocs.forEach((artiDoc) => {
            const artifactData = artiDoc.data();
            dbArtifacts[artiDoc.id] = artifactData;
          });
          
          return { id: charDoc.id, ...charData, dbArtifacts };
        })
      )

      setMyChars(dbCharacters);
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
      sx={{
        textAlign: 'center',
        padding: 2,
        minHeight: '100vh',
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
        myChars={myChars}
        setMyChars={setMyChars}
      />
    </Box>
  );
};

export default GI;
