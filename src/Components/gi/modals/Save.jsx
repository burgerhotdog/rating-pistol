import React, { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import Grid from '@mui/material/Grid2';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { db } from '../../../firebase';
import { characterImages } from '../data/images';
import template from '../data/template';
import characters from '../data/characters';
import weapons from '../data/weapons';
import { slot3, slot4, slot5, subs } from '../data/artifacts'

const Save = ({
  uid,
  isSaveOpen,
  setIsSaveOpen,
  isEditMode,
  myCharacters,
  setMyCharacters,
  newId,
  setNewId,
  newCharacter,
  setNewCharacter,
}) => {
  const [error, setError] = useState('');
  const [availableNames, setAvailableNames] = useState([]);

  /* Update available names when myCharacters changes */
  useEffect(() => {
    const notInMyCharacters = characters.filter(
      (item) => !Object.values(myCharacters).some((char) => char.name === item)
    );
    setAvailableNames(notInMyCharacters);
  }, [myCharacters]);

  /* Pass artifact inputs to newCharacter */
  const handleArtifact = (e) => {
    const { name, value } = e.target;
    const [outerKey, innerKey] = name.split('.');
    setNewCharacter((prevCharacter) => ({
      ...prevCharacter,
      [outerKey]: {
        ...prevCharacter[outerKey],
        [innerKey]: value,
      },
    }));
  };

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newCharacter.weapon) errors.push('No weapon selected!');
    if (
      !newCharacter.slot1.mainStat ||
      !newCharacter.slot2.mainStat ||
      !newCharacter.slot3.mainStat ||
      !newCharacter.slot4.mainStat ||
      !newCharacter.slot5.mainStat
    ) errors.push('Artifacts must be filled out!');

    // Display error message
    if (errors.length) {
      setError(errors.join(', '));
      return false;
    }
    setError('');
    return true;
  };

  /* Save button */
  const handleSave = async () => {
    // Perform validation checks
    if (!validate()) return;

    // Update document in Firestore
    if (uid) {
      const characterDocRef = doc(db, 'users', uid, 'GenshinImpact', newId);
      await setDoc(characterDocRef, newCharacter, { merge: true });
    }

    // Update entry in myCharacters
    setMyCharacters((prevCharacters) => ({
      ...prevCharacters,
      [newId]: newCharacter,
    }));

    setError('');
    setNewId('');
    setIsSaveOpen(false);
  };

  /* Cancel button */
  const handleCancel = () => {
    setError('');
    setNewId('');
    setIsSaveOpen(false);
  };

  return (
    <Modal open={isSaveOpen} onClose={handleCancel}>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: 4,
          borderRadius: 2,
          backgroundColor: '#1c1c1c',
        }}
      >
        {newId ? (
          <Grid container spacing={4} width='1000px'>
            <Grid size={6}>
              <Box display='flex'>
                {/* Select Character */}
                <Autocomplete
                  disablePortal
                  size='small'
                  value={newCharacter.name}
                  options={availableNames}
                  onChange={(event, newValue) => {
                    const words = newValue.replace(/'/g, '').split(' ');
                    const id = words.map(word => (
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    )).join('');
                    setNewId(id);
                    setNewCharacter(({
                      ...template(),
                      name: newValue,
                    }));
                  }}
                  sx={{ width: 200, mr: 2}}
                  renderInput={(params) => <TextField {...params} label="Character" />}
                  disabled={isEditMode}
                />

                {/* Select Weapon */}
                <Autocomplete
                  disablePortal
                  size='small'
                  value={newCharacter.weapon}
                  options={weapons}
                  sx={{ width: 200 }}
                  onChange={(event, newValue) => {
                    setNewCharacter((prev) => ({
                      ...prev,
                      weapon: newValue,
                    }));
                  }}
                  renderInput={(params) => <TextField {...params} label="Weapon" />}
                />
              </Box>
              {/* Image */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 500,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={characterImages[newId]}
                  alt='Character'
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>

            <Grid size={6}>
              <Grid container spacing={2}>
                {/* Slot 1 */}
                <Grid size={6}>
                  <Card sx={{ padding: 1 }}>
                    <Grid container spacing={1}>
                      <Grid size={4}>
                        <Typography variant="body1">Flower</Typography>
                      </Grid>
                      <Grid size={8}>
                        <Select
                          name='slot1.mainStat'
                          value={newCharacter.slot1.mainStat}
                          size='small'
                          fullWidth
                          disabled
                          sx={{
                            height: '32px'
                          }}
                        >
                          <MenuItem value='HP'>
                            HP
                          </MenuItem>
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot1.subStatName1'
                          value={newCharacter.slot1.subStatName1}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot1.subStatValue1"
                          value={newCharacter.slot1.subStatValue1}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot1.subStatName2'
                          value={newCharacter.slot1.subStatName2}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot1.subStatValue2"
                          value={newCharacter.slot1.subStatValue2}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot1.subStatName3'
                          value={newCharacter.slot1.subStatName3}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot1.subStatValue3"
                          value={newCharacter.slot1.subStatValue3}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot1.subStatName4'
                          value={newCharacter.slot1.subStatName4}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot1.subStatValue4"
                          value={newCharacter.slot1.subStatValue4}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Slot 2 */}
                <Grid size={6}>
                  <Card sx={{ padding: 1 }}>
                    <Grid container spacing={1}>
                      <Grid size={4}>
                        <Typography variant="body1">Plume</Typography>
                      </Grid>
                      <Grid size={8}>
                        <Select
                          name='slot2.mainStat'
                          value={newCharacter.slot2.mainStat}
                          size='small'
                          fullWidth
                          disabled
                          sx={{
                            height: '32px'
                          }}
                        >
                          <MenuItem value='ATK'>
                            ATK
                          </MenuItem>
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot2.subStatName1'
                          value={newCharacter.slot2.subStatName1}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot2.subStatValue1"
                          value={newCharacter.slot2.subStatValue1}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot2.subStatName2'
                          value={newCharacter.slot2.subStatName2}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot2.subStatValue2"
                          value={newCharacter.slot2.subStatValue2}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot2.subStatName3'
                          value={newCharacter.slot2.subStatName3}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot2.subStatValue3"
                          value={newCharacter.slot2.subStatValue3}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot2.subStatName4'
                          value={newCharacter.slot2.subStatName4}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot2.subStatValue4"
                          value={newCharacter.slot2.subStatValue4}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Slot 3 */}
                <Grid size={6}>
                  <Card sx={{ padding: 1 }}>
                    <Grid container spacing={1}>
                      <Grid size={4}>
                        <Typography variant="body1">Sands</Typography>
                      </Grid>
                      <Grid size={8}>
                        <Select
                          name='slot3.mainStat'
                          value={newCharacter.slot3.mainStat}
                          onChange={handleArtifact}
                          size='small'
                          displayEmpty
                          fullWidth
                          sx={{
                            height: '32px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (main)
                          </MenuItem>
                          {slot4.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot3.subStatName1'
                          value={newCharacter.slot3.subStatName1}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot3.subStatValue1"
                          value={newCharacter.slot3.subStatValue1}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot3.subStatName2'
                          value={newCharacter.slot3.subStatName2}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot3.subStatValue2"
                          value={newCharacter.slot3.subStatValue2}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot3.subStatName3'
                          value={newCharacter.slot3.subStatName3}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot3.subStatValue3"
                          value={newCharacter.slot3.subStatValue3}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot3.subStatName4'
                          value={newCharacter.slot3.subStatName4}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot3.subStatValue4"
                          value={newCharacter.slot3.subStatValue4}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Slot 4 */}
                <Grid size={6}>
                  <Card sx={{ padding: 1 }}>
                    <Grid container spacing={1}>
                      <Grid size={4}>
                        <Typography variant="body1">Goblet</Typography>
                      </Grid>
                      <Grid size={8}>
                        <Select
                          name='slot4.mainStat'
                          value={newCharacter.slot4.mainStat}
                          onChange={handleArtifact}
                          size='small'
                          displayEmpty
                          fullWidth
                          sx={{
                            height: '32px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (main)
                          </MenuItem>
                          {slot4.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot4.subStatName1'
                          value={newCharacter.slot4.subStatName1}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot4.subStatValue1"
                          value={newCharacter.slot4.subStatValue1}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot4.subStatName2'
                          value={newCharacter.slot4.subStatName2}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot4.subStatValue2"
                          value={newCharacter.slot4.subStatValue2}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot4.subStatName3'
                          value={newCharacter.slot4.subStatName3}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot4.subStatValue3"
                          value={newCharacter.slot4.subStatValue3}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot4.subStatName4'
                          value={newCharacter.slot4.subStatName4}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot4.subStatValue4"
                          value={newCharacter.slot4.subStatValue4}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Slot 5 */}
                <Grid size={6}>
                  <Card sx={{ padding: 1 }}>
                    <Grid container spacing={1}>
                      <Grid size={4}>
                        <Typography variant="body1">Circlet</Typography>
                      </Grid>
                      <Grid size={8}>
                        <Select
                          name='slot5.mainStat'
                          value={newCharacter.slot5.mainStat}
                          onChange={handleArtifact}
                          size='small'
                          displayEmpty
                          fullWidth
                          sx={{
                            height: '32px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (main)
                          </MenuItem>
                          {slot4.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot5.subStatName1'
                          value={newCharacter.slot5.subStatName1}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot5.subStatValue1"
                          value={newCharacter.slot5.subStatValue1}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot5.subStatName2'
                          value={newCharacter.slot5.subStatName2}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot5.subStatValue2"
                          value={newCharacter.slot5.subStatValue2}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot5.subStatName3'
                          value={newCharacter.slot5.subStatName3}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot5.subStatValue3"
                          value={newCharacter.slot5.subStatValue3}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Select
                          name='slot5.subStatName4'
                          value={newCharacter.slot5.subStatName4}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          displayEmpty
                          sx={{
                            height: '24px'
                          }}
                        >
                          <MenuItem value='' disabled>
                            (sub)
                          </MenuItem>
                          {subs.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          type="number"
                          name="slot5.subStatValue4"
                          value={newCharacter.slot5.subStatValue4}
                          onChange={handleArtifact}
                          size='small'
                          fullWidth
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '24px',
                              padding: '0 14px',
                            },
                            '& input': {
                              height: '100%',
                              padding: '0',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Box>
            <Typography variant='h6' gutterBottom>
              Add character
            </Typography>
            <Autocomplete
              disablePortal
              size='small'
              value={newCharacter.name}
              options={availableNames}
              onChange={(event, newValue) => {
                const words = newValue.replace(/'/g, '').split(' ');
                const id = words.map(word => (
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )).join('');
                setNewId(id);
                setNewCharacter(({
                  ...template(),
                  name: newValue,
                }));
              }}
              sx={{ width: 250, mb: 2 }}
              renderInput={(params) => <TextField {...params} label="Select" />}
            />
          </Box>
        )}

        {/* Error message */}
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {/* Buttons Section */}
        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          
          <Button 
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!newId}
          >
            Save
          </Button>
        </Box>
      </Box>      
    </Modal>
  );
};

export default Save;
