import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import {
  Box,
  Button,
  Container,
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
import Save from './components/Save';
import Delete from './components/Delete';
import template from './data/template';
import Score from './components/Score';

const GenshinImpact = ({ uid }) => {
  // Modal states
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Local character objects
  const [myCharacters, setMyCharacters] = useState({});

  // New character object
  const [newId, setNewId] = useState('');
  const [newCharacter, setNewCharacter] = useState(template);

  // Update local characters on uid change
  useEffect(() => {
    const fetchDB = async () => {
      if (uid) {
        // If signed in:
        // load characters from firestore
        const characterDocsRef = collection(db, 'users', uid, 'GenshinImpact');
        const characterDocs = await getDocs(characterDocsRef);
  
        // Convert documents to objects
        const docsToObjects = {};
        characterDocs.docs.forEach((characterDoc) => {
          docsToObjects[characterDoc.id] = characterDoc.data();
        });
  
        // Store objects in myCharacters
        setMyCharacters(docsToObjects);
      } else {
        // If signed out:
        // Clear myCharacters
        setMyCharacters({});
      }
    };
    fetchDB();
  }, [uid]);

  // Add character button handler
  const handleAddCharacter = () => {
    setNewId('');
    setNewCharacter(template());
    setIsEditMode(false);
    setIsSaveOpen(true);
  };

  // Edit button handler
  const handleEditCharacter = (id) => {
    setNewId(id);
    setNewCharacter(myCharacters[id]);
    setIsEditMode(true);
    setIsSaveOpen(true);
  };

  // Delete button handler
  const handleDeleteCharacter = (id) => {
    setNewId(id);
    setIsDeleteOpen(true);
  };

  return (
    <Container maxWidth='md'>
      <Box
        component='header'
        display='flex'
        flexDirection='column'
        alignItems='center'
        sx={{ mt: 4 }}
      >
        <Typography variant='h4'>Genshin Impact</Typography>
        <BackToMenu />
      </Box>

      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
      >
        <TableContainer sx={{ maxWidth: 800, mt: 2 }}>
          <Table>
            {/* Table headers */}
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Weapon</TableCell>
                <TableCell>Artifacts</TableCell>
                <TableCell>Score</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            {/* Table data */}
            <TableBody>
              {Object.keys(myCharacters).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align='center'>
                    No characters to display
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(myCharacters).map(([id, character]) => (
                  <TableRow key={id}>
                    <TableCell>{character.name}</TableCell>
                    <TableCell>{character.weapon}</TableCell>
                    <TableCell>{character.slotSet}</TableCell>
                    <TableCell><Score character={character} /></TableCell>
                    <TableCell>
                      {/* Edit button */}
                      <Button
                        size='small'
                        variant='outlined'
                        color='primary'
                        onClick={() => handleEditCharacter(id)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>

                      {/* Delete button */}
                      <Button
                        size='small'
                        variant='outlined'
                        color='secondary'
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

        {/* Add character button */}
        <Button
          variant='contained'
          color='primary'
          onClick={handleAddCharacter}
          sx={{ mt: 2 }}
        >
          Add character
        </Button>

        {/* Save modal */}
        <Save
          uid={uid}
          isSaveOpen={isSaveOpen}
          setIsSaveOpen={setIsSaveOpen}
          isEditMode={isEditMode}
          myCharacters={myCharacters}
          setMyCharacters={setMyCharacters}
          newId={newId}
          setNewId={setNewId}
          newCharacter={newCharacter}
          setNewCharacter={setNewCharacter}
        />

        {/* Delete modal */}
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
    </Container>
  );
};

export default GenshinImpact;
