import React, { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import Grid from '@mui/material/Grid2';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { db } from '../../../firebase';
import { characterImages, weaponImages } from '../data/images'

/* Used for converting character names to ids */
function toPascalCase(str) {
  return str
    .replace(/'/g, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

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
  const mainStatCirclet = ['HP%', 'ATK%', 'DEF%', 'CRIT Rate', 'CRIT DMG', 'Healing Bonus'];

  /* Update available names when myCharacters changes */
  useEffect(() => {
    const notInMyCharacters = characterNames.filter(
      (item) => !Object.values(myCharacters).some((char) => char.name === item)
    );
    setAvailableNames(notInMyCharacters);
  }, [myCharacters]);

  /* Handle form inputs */
  const handleInput = (e) => {
    const { name, value } = e.target;

    // Set the id if the field was the name
    if (name === 'name') {
      setNewId(toPascalCase(value));
    }
  
    // Check if the name refers to a nested property (e.g., 'weapon.name')
    if (name.includes('.')) {
      const [outerKey, innerKey] = name.split('.');  // e.g., 'weapon' and 'name'
  
      setNewCharacter((prevCharacter) => ({
        ...prevCharacter,  // Copy the outer object
        [outerKey]: {
          ...prevCharacter[outerKey],  // Copy the inner object (e.g., 'weapon')
          [innerKey]: value,           // Update the nested property
        },
      }));
    } else {
      // For non-nested properties, just update the property directly
      setNewCharacter((prevCharacter) => ({
        ...prevCharacter,  // Copy the outer object
        [name]: value,     // Update the property
      }));
    }
  };

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newId) errors.push('No name selected');
    if (!newCharacter.weapon || !newCharacter.weapon.name) errors.push('No weapon selected');

    // Display message
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
          <Select
            size='small'
            name='name'
            value={newCharacter.name || ''}
            onChange={handleInput}
            displayEmpty
          >
            <MenuItem value='' disabled>
              (select)
            </MenuItem>
            {availableNames.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Character form */}
        {newId && (
          <Box>
            <Grid container spacing={4}>
              <Grid size={4}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 200,
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
                <Box display="flex" justifyContent='center' gap={2} mt={2}>
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
              </Grid>

              <Grid size={4}>
                <Typography variant="h6">Weapon</Typography>
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
                  sx={{ marginTop: 2 }}
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
