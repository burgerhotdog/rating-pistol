import React, { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import Grid from '@mui/material/Grid2';
import {
  Autocomplete,
  Box,
  Button,
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

const Add = ({
  uid,
  isAddOpen,
  setIsAddOpen,
  myCharacters,
  setMyCharacters,
  newId,
  setNewId,
  newCharacter,
  setNewCharacter,
}) => {
  const [error, setError] = useState('');
  const [availableNames, setAvailableNames] = useState([]);

  const characterNames = ['Venti', 'Zhongli', 'Raiden Shogun', 'Nahida', 'Furina'];
  const weaponNames = ['Elegy for the End', 'Vortex Vanquisher', 'Engulfing Lightning', 'A Thousand Floating Dreams', 'Splendor of Tranquil Waters'];
  const mainStatSands = ['HP%', 'ATK%', 'DEF%', 'Elemental Mastery', 'Energy Recharge'];
  const mainStatGoblet = ['HP%', 'ATK%', 'DEF%', 'Elemental Mastery', 'Elemental DMG Bonus', 'Physical DMG Bonus'];
  const mainStatCirclet = ['HP%', 'ATK%', 'DEF%', 'Elemental Mastery', 'CRIT Rate', 'CRIT DMG', 'Healing Bonus'];

  /* Update available names when myCharacters changes */
  useEffect(() => {
    const notInMyCharacters = characterNames.filter(
      (item) => !Object.values(myCharacters).some((char) => char.name === item)
    );
    setAvailableNames(notInMyCharacters);
  }, [myCharacters]);

  /* Pass name input to newId and newCharacter */
  const handleNameInput = (value) => {
    // convert name to id
    const words = value.replace(/'/g, '').split(' ');
    const id = words.map(word => (
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )).join('');

    // set new id and name
    setNewId(id);
    setNewCharacter(({
      ...template(),
      name: value,
    }));
  };

  /* Pass form inputs to newCharacter */
  const handleInput = (e) => {
    const { name, value } = e.target;

    // Check if the name points to a map
    if (name.includes('.')) {
      const [outerKey, innerKey] = name.split('.');
  
      setNewCharacter((prevCharacter) => ({
        ...prevCharacter,
        [outerKey]: {
          ...prevCharacter[outerKey],
          [innerKey]: value,
        },
      }));
    } else {
      setNewCharacter((prevCharacter) => ({
        ...prevCharacter,
        [name]: value,
      }));
    }
  };

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newId) errors.push('No character selected');
    if (!newCharacter.weapon.name) errors.push('No weapon selected');
    if (!newCharacter.slot3.mainStat) errors.push('No sands selected');
    if (!newCharacter.slot4.mainStat) errors.push('No goblet selected');
    if (!newCharacter.slot5.mainStat) errors.push('No Circlet selected');

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
    setIsAddOpen(false);
  };

  /* Cancel button */
  const handleCancel = () => {
    setError('');
    setNewId('');
    setIsAddOpen(false);
  };

  return (
    <Modal open={isAddOpen} onClose={handleCancel}>
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
          width: '80%',
          height: '80%',
          padding: 4,
          borderRadius: 2,
          backgroundColor: '#1c1c1c',
        }}
      >
        {/* Title & Select character*/}
        <Box display='flex'>
          <Typography 
            variant='button'
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginRight: 2,
            }}
          >
            Add character
          </Typography>
          <Autocomplete
            disablePortal
            size='small'
            value={newCharacter.name}
            options={availableNames}
            onChange={(event, newValue) => handleNameInput(newValue)}
            sx={{ width: 200 }}
            renderInput={(params) => <TextField {...params} label="Name" />}
          />
        </Box>

        {newId && (
          <Box>
            <Grid container spacing={4}>
              {/* Character image */}
              <Grid size={4}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 256,
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

              <Grid size={4}>
                <Typography variant="h6">Character details</Typography>

                <Box display="flex" justifyContent='center' gap={2} mt={1}>
                  <TextField
                    size='small'
                    fullWidth
                    label='Level'
                    type='number'
                    name='level'
                    value={newCharacter.level}
                    onChange={handleInput}
                  />

                  <TextField
                    size='small'
                    fullWidth
                    label='Constellation'
                    type='number'
                    name='constellation'
                    value={newCharacter.constellation}
                    onChange={handleInput}
                  />
                </Box>
                <Typography variant="h6" sx={{ mt: 1 }}>Weapon details</Typography>

                <FormControl fullWidth size='small' sx={{ mt: 1 }}>
                  <Autocomplete
                    fullwidth
                    disablePortal
                    size='small'
                    name={newCharacter.weapon}
                    value={newCharacter.weapon.name}
                    options={weaponNames}
                    onChange={(event, newValue) => {
                      // Update weapon name in newCharacter
                      setNewCharacter((prevCharacter) => ({
                        ...prevCharacter,
                        weapon: {
                          ...prevCharacter.weapon,
                          name: newValue || '', // Set weapon name to the selected value
                        },
                      }));
                    }}
                    renderInput={(params) => <TextField {...params} label="Name" />}
                  />
                </FormControl>

                <Box display="flex" justifyContent="center" gap={2} mt={2}>
                  <TextField
                    size='small'
                    fullWidth
                    label='Level'
                    type="number"
                    name="weapon.level"
                    value={newCharacter.weapon.level}
                    onChange={handleInput}
                  />

                  <TextField
                    size='small'
                    fullWidth
                    label='Refinement'
                    type="number"
                    name="weapon.refinement"
                    value={newCharacter.weapon.refinement}
                    onChange={handleInput}
                  />
                </Box>
              </Grid>

              <Grid size={4}>
                <Typography variant="h6">Talents</Typography>

                <TextField
                  label='Normal'
                  type='number'
                  name='talents.normal'
                  value={newCharacter.talents.normal}
                  onChange={handleInput}
                  fullWidth
                  size='small'
                  sx={{ marginTop: 1 }}
                />
                
                <TextField
                  label='Skill'
                  type='number'
                  name='talents.skill'
                  value={newCharacter.talents.skill}
                  onChange={handleInput}
                  fullWidth
                  size='small'
                  sx={{ marginTop: 2 }}
                />

                <TextField
                  label='Burst'
                  type='number'
                  name='talents.burst'
                  value={newCharacter.talents.burst}
                  onChange={handleInput}
                  fullWidth
                  size='small'
                  sx={{ marginTop: 2 }}
                />
              </Grid>
            </Grid>
              
            <Typography variant="h6">Artifacts</Typography>
            <Grid container spacing={4}>
              <Grid size={2.4}>
                <FormControl fullWidth size='small'>
                  <InputLabel id='slot1-label'>Flower</InputLabel>
                  <Select
                    labelId="slot1-label"
                    name='slot1.mainStat'
                    value={newCharacter.slot1.mainStat}
                    disabled
                  >
                    <MenuItem value='HP'>
                      HP
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={2.4}>
                <FormControl fullWidth size='small'>
                  <InputLabel id='slot2-label'>Plume</InputLabel>
                  <Select
                    labelId="slot2-label"
                    name='slot2.mainStat'
                    value={newCharacter.slot2.mainStat}
                    disabled
                  >
                    <MenuItem value='ATK'>
                      ATK
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={2.4}>
                <FormControl fullWidth size='small'>
                  <InputLabel id='slot3-label' shrink>Sands</InputLabel>
                  <Select
                    labelId='slot3-label'
                    name='slot3.mainStat'
                    value={newCharacter.slot3.mainStat}
                    onChange={handleInput}
                    displayEmpty
                  >
                    <MenuItem value=''>
                      (select)
                    </MenuItem>
                    {mainStatSands.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={2.4}>
                <FormControl fullWidth size='small'>
                  <InputLabel id='slot4-label' shrink>Goblet</InputLabel>
                  <Select
                    labelId='slot4-label'
                    name='slot4.mainStat'
                    value={newCharacter.slot4.mainStat}
                    onChange={handleInput}
                    displayEmpty
                  >
                    <MenuItem value=''>
                      (select)
                    </MenuItem>
                    {mainStatGoblet.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={2.4}>
                <FormControl fullWidth size='small'>
                  <InputLabel id='slot5-label' shrink>Circlet</InputLabel>
                  <Select
                    labelId='slot5-label'
                    name='slot5.mainStat'
                    value={newCharacter.slot5.mainStat}
                    onChange={handleInput}
                    displayEmpty
                  >
                    <MenuItem value=''>
                      (select)
                    </MenuItem>
                    {mainStatCirclet.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Error message */}
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {/* Buttons Section */}
        <Grid size={12}>
          <Box display="flex" justifyContent="center" gap={2} mt={2}>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
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
        </Grid>
      </Box>      
    </Modal>
  );
};

export default Add;
