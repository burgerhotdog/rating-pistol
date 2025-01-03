import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
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
  useTheme,
  useMediaQuery,
} from '@mui/material';

import { db } from '../../firebase';
import Back from '../Back';
import Save from './components/Save';
import Delete from './components/Delete';
import initCharObj from './components/initCharObj';

const iconMedia = import.meta.glob('../../assets/ww/icon/*.webp', { eager: true });
const weaponMedia = import.meta.glob('../../assets/ww/weapon/*.webp', { eager: true });
const setMedia = import.meta.glob('../../assets/ww/set/*.webp', { eager: true });

const WutheringWaves = ({ uid }) => {
  // Modal States
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Local Character Objects
  const [myChars, setMyChars] = useState({});

  // New Character Object
  const [newCharId, setNewCharId] = useState('');
  const [newCharObj, setNewCharObj] = useState(initCharObj);

  // Mobile layout breakpoint
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'));

  // Populate myChars when user signs in/out
  useEffect(() => {
    const fetchDB = async () => {
      if (uid) {
        // Fetch character documents from firestore
        const charDocsRef = collection(db, 'users', uid, 'WutheringWaves');
        const charDocs = await getDocs(charDocsRef);
  
        // Convert documents to objects
        const docsToObjs = {};
        charDocs.docs.forEach((charDoc) => {
          docsToObjs[charDoc.id] = charDoc.data();
        });
  
        // Store objects in myChars
        setMyChars(docsToObjs);
      } else {
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
    <Container>
      <Back />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4,
      }}>
        <Typography variant='h4'>Wuthering Waves</Typography>
        <Typography variant="body2">Updated for version 2.0</Typography>
        <TableContainer sx={{ maxWidth: 900 }}>
          <Table>
            {/* Table headers */}
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                {!isMobile && <TableCell>Weapon</TableCell>}
                {!isMobile && <TableCell>Echoes</TableCell>}
                <TableCell>Score</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            {/* Table data */}
            <TableBody>
              {Object.keys(myChars).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    No characters to display
                  </TableCell>
                </TableRow>
              ) : (
                // Order characters in table by score
                Object.entries(myChars)
                .sort(([, a], [, b]) => Number(b.score) - Number(a.score))
                .map(([id, char]) => (
                  <TableRow key={id}>
                    <TableCell>
                      <img
                        src={iconMedia[`../../assets/ww/icon/${id}_Icon.webp`]?.default}
                        alt={char.name || 'Icon'}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: 'contain',
                        }}
                      />
                    </TableCell>
                    <TableCell>{char.name}</TableCell>
                    {!isMobile && (
                      <TableCell>
                        <img
                          src={weaponMedia[`../../assets/ww/weapon/${char.weapon.key}.webp`]?.default}
                          alt={char.weapon.entry.name || 'Weapon'}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: 'contain',
                          }}
                        />
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell>
                        <img
                          src={setMedia[`../../assets/ww/set/${char.set.key}.webp`]?.default}
                          alt={char.set.entry.name || 'Set'}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: 'contain',
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell>{char.score}</TableCell>
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

export default WutheringWaves;
