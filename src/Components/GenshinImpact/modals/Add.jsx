import React, { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import Grid from '@mui/material/Grid2';
import {
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
import RaidenImage from '../../../assets/characters/GenshinImpact/RaidenShogun.webp'

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

  /* Update available names when myCharacters changes */
  useEffect(() => {
    const notInMyCharacters = characterNames.filter(
      (item) => !Object.values(myCharacters).some((char) => char.name === item)
    );
    setAvailableNames(notInMyCharacters);
  }, [myCharacters]);

  /* Handle character field inputs */
  const handleCharacterField = (e) => {
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
    if (!newId) errors.push("No name selected");
    if (!newCharacter.weapon || !newCharacter.weapon.name) errors.push("No weapon selected");

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
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Title & Select character*/}
        <Box display='flex'>
          <Typography 
            variant='button'
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 2,
            }}
          >
            Add character
          </Typography>
          <Select
            size='small'
            name="name"
            value={newCharacter.name || ''}
            onChange={handleCharacterField}
            displayEmpty
          >
            <MenuItem value="" disabled>
              (select)
            </MenuItem>
            {availableNames.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Character, Weapon, Talents */}
        {newId && (
          <FormControl size='small'>
            <Grid container spacing={4}>
              <Grid size={4}>
                <img
                  width='100%'
                  src={RaidenImage}
                  alt="Raiden"
                />
                <Box display="flex" justifyContent="center" gap={2} mt={2}>
                  <TextField
                    fullWidth
                    label='Level'
                    type="number"
                    name="level"
                    value={newCharacter.level}
                    onChange={handleCharacterField}
                  />

                  <TextField
                    fullWidth
                    label='Constellation'
                    type="number"
                    name="constellation"
                    value={newCharacter.constellation}
                    onChange={handleCharacterField}
                  />
                </Box>
              </Grid>

              <Grid size={4}>
                <Typography variant="h6">Weapon</Typography>
                <Box display="flex" justifyContent="center" gap={2} mt={2}>
                  <TextField
                    fullWidth
                    label='Level'
                    type="number"
                    name="weapon.level"
                    value={newCharacter.weapon.level}
                    onChange={handleCharacterField}
                  />

                  <TextField
                    fullWidth
                    label='Refinement'
                    type="number"
                    name="weapon.refinement"
                    value={newCharacter.weapon.refinement}
                    onChange={handleCharacterField}
                  />
                </Box>
              </Grid>

              <Grid size={4}>
                <Typography variant="h6">Talents</Typography>

                <TextField
                  fullWidth
                  label='Normal'
                  type="number"
                  name="talents.normal"
                  value={newCharacter.talents.normal}
                  onChange={handleCharacterField}
                />
                
                <TextField
                  fullWidth
                  label='Skill'
                  type="number"
                  name="talents.skill"
                  value={newCharacter.talents.skill}
                  onChange={handleCharacterField}
                />

                <TextField
                  fullWidth
                  label='Burst'
                  type="number"
                  name="talents.burst"
                  value={newCharacter.talents.burst}
                  onChange={handleCharacterField}
                />
              </Grid>
            </Grid>
              
            <Typography variant="h6">Artifacts</Typography>
            <Grid container spacing={4}>
              <Grid size={2.4}>
                <FormControl size='small'>
                  <InputLabel id="flower-label">Flower</InputLabel>
                  <Select
                    labelId="flower-label"
                    name='flower'
                    value={'HP'}
                    disabled
                  >
                    <MenuItem value='HP'>
                      HP
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={2.4}>
                <Select
                  fullWidth
                  label='plume'
                  name='plume'
                  value={'ATK'}
                  disabled
                >
                  <MenuItem value='ATK'>
                    ATK
                  </MenuItem>
                </Select>
              </Grid>

              <Grid size={2.4}>
                <Select
                  fullWidth
                  label='sands'
                  name='sands'
                  value={''}
                >
                  <MenuItem value="">
                    (select)
                  </MenuItem>
                </Select>
              </Grid>

              <Grid size={2.4}>
                <Select
                  fullWidth
                  label='goblet'
                  name='goblet'
                  value={''}
                >
                  <MenuItem value="">
                    (select)
                  </MenuItem>
                </Select>
              </Grid>

              <Grid size={2.4}>
                <Select
                  fullWidth
                  label='circlet'
                  name='circlet'
                  value={''}
                >
                  <MenuItem value="">
                    (select)
                  </MenuItem>
                </Select>
              </Grid>
            </Grid>
          </FormControl>
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
