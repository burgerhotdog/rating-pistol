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
import SlotCard from './SlotCard';
import template from './template';
import characterdb from '../data/characters';
import weapondb from '../data/weapons';
import setdb from '../data/sets';

const images = import.meta.glob('../../../assets/gi/*.webp', { eager: true });

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
    const characterNames = Object.keys(characterdb);
    const notInMyCharacters = characterNames.filter(
      (id) => !Object.keys(myCharacters).includes(id)
    );
    setAvailableNames(notInMyCharacters);
  }, [myCharacters]);

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newCharacter.weapon) errors.push('No weapon selected');
    if (!newCharacter.set) errors.push('No artifact set selected');

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
      {/* Modal Styles */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#1c1c1c',
        padding: 4,
        borderRadius: 2,
      }}>        
        {/* Data grid */}
        {newId ? (
          <Grid container spacing={2} sx={{ width: 1024 }}>
            {/* Select character */}
            <Grid size={3}>
              <Autocomplete
                disablePortal
                size='small'
                value={newId}
                options={availableNames}
                onChange={(event, newValue) => {
                  const selectedCharacter = characterdb[newValue];  // Get the character by id
                  setNewId(newValue);  // Set the id (key)
                  setNewCharacter(({
                    ...template(),
                    name: selectedCharacter.name,  // Set the character name
                  }));
                }}
                getOptionLabel={(id) => characterdb[id]?.name || ''}  // Display the character name in the dropdown
                isOptionEqualToValue={(option, value) => option === value}  // Compare ids for selection
                fullWidth
                renderInput={(params) => <TextField {...params} label="Character" />}
                disabled={isEditMode}
              />
            </Grid>

            {/* Select weapon */}
            <Grid size={3}>
              <Autocomplete
                disablePortal
                size='small'
                value={newCharacter.weapon}
                options={weapondb}
                fullWidth
                onChange={(event, newValue) => {
                  setNewCharacter((prev) => ({
                    ...prev,
                    weapon: newValue,
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="Weapon" />}
              />
            </Grid>

            {/* Select artifact set */}
            <Grid size={6}>
              <Autocomplete
                disablePortal
                size='small'
                value={newCharacter.set}
                options={setdb}
                fullWidth
                onChange={(event, newValue) => {
                  setNewCharacter((prev) => ({
                    ...prev,
                    set: newValue,
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="Artifact Set" />}
              />
            </Grid>

            {/* Image */}
            <Grid size={6}>
              <img
                src={images[`../../../assets/gi/${newId}.webp`]?.default}
                style={{
                  width: '100%',
                  height: 500,
                  objectFit: 'contain',
                }}
              />
            </Grid>

            {/* Artifact grid */}
            <Grid size={6}>
              <Grid container spacing={2}>
                {['Flower', 'Plume', 'Sands', 'Goblet', 'Circlet'].map(
                  (slotName, index) => (
                    <Grid size={6} key={slotName}>
                      <SlotCard
                        slotName={slotName}
                        slotIndex={index}
                        newId={newId}
                        newCharacter={newCharacter}
                        setNewCharacter={setNewCharacter}
                      />
                    </Grid>
                  )
                )}
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Autocomplete
            disablePortal
            size='small'
            value={newId}
            options={availableNames}
            onChange={(event, newValue) => {
              const selectedCharacter = characterdb[newValue];  // Get the character by id
              setNewId(newValue);  // Set the id (key)
              setNewCharacter(({
                ...template(),
                name: selectedCharacter.name,  // Set the character name
              }));
            }}
            getOptionLabel={(id) => characterdb[id]?.name || ''}  // Display the character name in the dropdown
            isOptionEqualToValue={(option, value) => option === value}  // Compare ids for selection
            sx={{ width: 200 }}
            renderInput={(params) => <TextField {...params} label="Select" />}
          />
        )}

        {/* Error section */}
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {/* Buttons section */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mt: 2,
        }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            sx={{ width: 80 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!newId}
            sx={{ width: 80 }}
          >
            Save
          </Button>
        </Box>
      </Box>      
    </Modal>
  );
};

export default Save;
