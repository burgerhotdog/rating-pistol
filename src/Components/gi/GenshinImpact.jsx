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
import Save from './modals/Save';
import Delete from './modals/Delete';
import Enka from './modals/Enka';
import template from './data/template';

const GenshinImpact = ({ uid }) => {
  /* Modal states */
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEnkaOpen, setIsEnkaOpen] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  /* Local character object */
  const [myCharacters, setMyCharacters] = useState({});

  /* New character data structures: */
  const [newId, setNewId] = useState('');
  const [newCharacter, setNewCharacter] = useState(template);

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

  /* Add character button */
  const handleAddCharacter = () => {
    setNewId('');
    setNewCharacter(template());
    setIsEditMode(false);
    setIsSaveOpen(true);
  };

  /* Edit button */
  const handleEditCharacter = (id) => {
    setNewId(id);
    setNewCharacter(myCharacters[id]);
    setIsEditMode(true);
    setIsSaveOpen(true);
  };

  /* Delete button */
  const handleDeleteCharacter = (id) => {
    setNewId(id);
    setIsDeleteOpen(true);
  };

  /* Enka button */
  const handleAddEnka = () => {
    setNewId('');
    setNewCharacter(template());
    setIsEditMode(false);
    setIsEnkaOpen(true);
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
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Weapon</TableCell>
                <TableCell>Artifacts</TableCell>
                <TableCell>Score</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

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
                    <TableCell></TableCell>
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
          Add character manually
        </Button>

        {/* Add character from enka button */}
        <Button
          variant='contained'
          color='primary'
          onClick={handleAddEnka}
          sx={{ mt: 2 }}
        >
          Load characters from uid
        </Button>

        {/* modal for add character */}
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

        {/* modal for delete character */}
        <Delete
          uid={uid}
          isDeleteOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          myCharacters={myCharacters}
          setMyCharacters={setMyCharacters}
          newId={newId}
          setNewId={setNewId}
        />

        {/* modal for enka */}
        <Enka
          uid={uid}
          isEnkaOpen={isEnkaOpen}
          setIsEnkaOpen={setIsEnkaOpen}
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
