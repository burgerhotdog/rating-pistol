import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
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
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

import { db } from '../../firebase';
import BackToMenu from '../BackToMenu';
import Score from './components/Score';
import Save from './components/Save';
import Delete from './components/Delete';
import initCharObj from './components/initCharObj';

import weapData from './data/weapData';

const GenshinImpact = ({ uid }) => {
  // Modal states
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Local character objects
  const [myChars, setMyChars] = useState({});

  // New character object
  const [newCharId, setNewCharId] = useState('');
  const [newCharObj, setNewCharObj] = useState(initCharObj);

  // Update myChars on uid change
  useEffect(() => {
    const fetchDB = async () => {
      if (uid) {
        // If signed in:
        // Fetch character documents from firestore
        const charDocsRef = collection(db, 'users', uid, 'GenshinImpact');
        const charDocs = await getDocs(charDocsRef);
  
        // Convert documents to objects
        const docsToObjs = {};
        charDocs.docs.forEach((charDoc) => {
          docsToObjs[charDoc.id] = charDoc.data();
        });
  
        // Store objects in myChars
        setMyChars(docsToObjs);
      } else {
        // If signed out:
        // Clear myChars
        setMyChars({});
      }
    };
    fetchDB();
  }, [uid]);

  // Add character button handler
  const handleAdd = () => {
    setNewCharId('');
    setNewCharObj(initCharObj());
    setIsEditMode(false);
    setIsSaveOpen(true);
  };

  // Edit button handler
  const handleEdit = (id) => {
    setNewCharId(id);
    setNewCharObj(myChars[id]);
    setIsEditMode(true);
    setIsSaveOpen(true);
  };

  // Delete button handler
  const handleDelete = (id) => {
    setNewCharId(id);
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
              {Object.keys(myChars).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align='center'>
                    No characters to display
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(myChars).map(([id, char]) => (
                  <TableRow key={id}>
                    <TableCell>{char.name}</TableCell>
                    <TableCell>{weapData[char.weapId].name}</TableCell>
                    <TableCell>{char.set}</TableCell>
                    <TableCell><Score char={char} /></TableCell>
                    <TableCell>
                      {/* Edit button */}
                      <Button
                        size='small'
                        variant='outlined'
                        color='primary'
                        onClick={() => handleEdit(id)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </Button>

                      {/* Delete button */}
                      <Button
                        size='small'
                        variant='outlined'
                        color='secondary'
                        onClick={() => handleDelete(id)}
                      >
                        <DeleteIcon />
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
          onClick={handleAdd}
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
          myChars={myChars}
          setMyChars={setMyChars}
          newCharId={newCharId}
          setNewCharId={setNewCharId}
          newCharObj={newCharObj}
          setNewCharObj={setNewCharObj}
        />

        {/* Delete modal */}
        <Delete
          uid={uid}
          isDeleteOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          myChars={myChars}
          setMyChars={setMyChars}
          newCharId={newCharId}
          setNewCharId={setNewCharId}
          newCharObj={newCharObj}
          setNewCharObj={setNewCharObj}
        />
      </Box>        
    </Container>
  );
};

export default GenshinImpact;
