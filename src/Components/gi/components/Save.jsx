import React, { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import Grid from '@mui/material/Grid2';
import {
  Autocomplete,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { db } from '../../../firebase';
import images from '../data/images';
import template from '../data/template';
import characters from '../data/characters';
import weapons from '../data/weapons';
import { slot3, slot4, slot5, subs } from '../data/slotStats';
import sets from '../data/slotSets';
import SlotCard from './SlotCard';

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

  // Update available names when myCharacters changes
  useEffect(() => {
    const notInMyCharacters = characters.filter(
      (item) => !Object.values(myCharacters).some((char) => char.name === item)
    );
    setAvailableNames(notInMyCharacters);
  }, [myCharacters]);

  // Pass artifact inputs to newCharacter
  const handleArtifact = (e) => {
    const { name, value } = e.target;
    const [outerKey, innerKey] = name.split('.');

    setNewCharacter((prevCharacter) => {
      const updatedSlot = {
        ...prevCharacter[outerKey],
        [innerKey]: value,
      };

      // Check if the mainStat is being updated
      if (innerKey === 'mainStat') {
        // Reset substats when mainStat changes
        updatedSlot.subStatName1 = '';
        updatedSlot.subStatValue1 = 0;
        updatedSlot.subStatName2 = '';
        updatedSlot.subStatValue2 = 0;
        updatedSlot.subStatName3 = '';
        updatedSlot.subStatValue3 = 0;
        updatedSlot.subStatName4 = '';
        updatedSlot.subStatValue4 = 0;
      }

      return {
        ...prevCharacter,
        [outerKey]: updatedSlot,
      };
    });
  };

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newCharacter.weapon) errors.push('No weapon selected');
    if (!newCharacter.slotSet) errors.push('No artifact set selected');

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

  // Cancel button handler
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
                  mt: 2,
                }}
              >
                <img
                  src={images[newId]}
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
              <Autocomplete
                disablePortal
                size='small'
                value={newCharacter.slotSet}
                options={sets}
                sx={{ width: 200 }}
                onChange={(event, newValue) => {
                  setNewCharacter((prev) => ({
                    ...prev,
                    slotSet: newValue,
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="Artifact Set" />}
              />
              <Grid container spacing={2} mt={2}>
                {/* Slot 1 */}
                <Grid size={6}>
                  <SlotCard
                    slotName={'Flower'}
                    slotNumber={'slot1'}
                    newId={newId}
                    newCharacter={newCharacter}
                    handleArtifact={handleArtifact}
                  />
                </Grid>

                {/* Slot 2 */}
                <Grid size={6}>
                  <SlotCard
                    slotName={'Plume'}
                    slotNumber={'slot2'}
                    newId={newId}
                    newCharacter={newCharacter}
                    handleArtifact={handleArtifact}
                  />
                </Grid>

                {/* Slot 3 */}
                <Grid size={6}>
                  <SlotCard
                    slotName={'Sands'}
                    slotNumber={'slot3'}
                    newId={newId}
                    newCharacter={newCharacter}
                    handleArtifact={handleArtifact}
                  />
                </Grid>

                {/* Slot 4 */}
                <Grid size={6}>
                  <SlotCard
                    slotName={'Goblet'}
                    slotNumber={'slot4'}
                    newId={newId}
                    newCharacter={newCharacter}
                    handleArtifact={handleArtifact}
                  />
                </Grid>

                {/* Slot 5 */}
                <Grid size={6}>
                  <SlotCard
                    slotName={'Circlet'}
                    slotNumber={'slot5'}
                    newId={newId}
                    newCharacter={newCharacter}
                    handleArtifact={handleArtifact}
                  />
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
