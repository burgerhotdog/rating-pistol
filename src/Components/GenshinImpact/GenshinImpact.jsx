import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { db } from '../../firebase';
import BackToMenu from '../BackToMenu';
import Save from './modals/Save';
import Delete from './modals/Delete';
import { templateArtifact, templateCharacter } from './data/template';

const GenshinImpact = ({ uid }) => {
  // Modal states
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Local character object
  const [myCharacters, setMyCharacters] = useState({});

  /* New character data structures: */
  // Id
  const [newId, setNewId] = useState('');
  // Character
  const [newCharacter, setNewCharacter] = useState(templateCharacter);
  // Artifact map
  // const [newArtifacts, setNewArtifacts] = useState({});

  // Update myCharacters when user signs in or out
  useEffect(() => {
    const fetchDB = async () => {
      // If signed out, clears myCharacters
      if (!uid) {
        setMyCharacters({});
        return;
      }

      // If signed in, loads myCharacters from firestore
      // Pull character documents
      const characterDocsRef = collection(db, 'users', uid, 'GenshinImpact');
      const characterDocs = await getDocs(characterDocsRef);

      const myCharactersObj = {};
      characterDocs.docs.forEach((characterDoc) => {
        myCharactersObj[characterDoc.id] = characterDoc.data();
      });

      setMyCharacters(myCharactersObj);
    };
    fetchDB();
  }, [uid]);

  /* Button handlers */
  // Add character
  const handleAddCharacter = () => {
    setNewId('');
    setNewCharacter(templateCharacter());
    setIsSaveOpen(true);
  };

  // Edit
  const handleEditCharacter = (id) => {
    setNewId(id);
    setNewCharacter(myCharacters[id]);
    setIsSaveOpen(true);
  };

  // Delete
  const handleDeleteCharacter = (id) => {
    setNewId(id);
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
            {Object.keys(myCharacters).length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No characters to display
                </TableCell>
              </TableRow>
            ) : (
              Object.entries(myCharacters).map(([id, character]) => (
                <TableRow key={id}>
                  <TableCell>{character.name}</TableCell>
                  <TableCell>{character.constellation}</TableCell>
                  <TableCell>{character.weapon.name}</TableCell>
                  <TableCell>{character.weapon.refinement}</TableCell>
                  <TableCell>
                    {/* Edit button */}
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditCharacter(id)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    {/* Delete button */}
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteCharacter(id)}
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
      <Button variant="contained" color="primary" onClick={handleAddCharacter}>
        Add Character
      </Button>

      {/* modal to add or edit character */}
      <Save
        uid={uid}
        isSaveOpen={isSaveOpen}
        setIsSaveOpen={setIsSaveOpen}
        myCharacters={myCharacters}
        setMyCharacters={setMyCharacters}
        newId={newId}
        setNewId={setNewId}
        newCharacter={newCharacter}
        setNewCharacter={setNewCharacter}
      />

      {/* modal to delete character */}
      <Delete
        uid={uid}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        myCharacters={myCharacters}
        setMyCharacters={setMyCharacters}
        newId={newId}
        setNewId={setNewId}
      />
    </Box>
  );
};

export default GenshinImpact;
