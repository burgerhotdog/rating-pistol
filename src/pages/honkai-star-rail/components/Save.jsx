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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { db } from '../../../firebase';
import Piece from './Piece';
import getScore from '../getScore';
import initCharObj from '../initCharObj';
import charData from '../data/charData';
import weapData from '../data/weapData';
import setData from '../data/setData';

const iconMedia = import.meta.glob('../assets/icon/*.webp', { eager: true });
const weaponMedia = import.meta.glob('../assets/weapon/*.webp', { eager: true });

const Save = ({
  uid,
  isSaveOpen,
  setIsSaveOpen,
  isEditMode,
  myChars,
  setMyChars,
  newCharId,
  setNewCharId,
  newCharObj,
  setNewCharObj,
}) => {
  const [error, setError] = useState('');
  const [availableCharIds, setAvailableCharIds] = useState([]);
  const [availableWeapIds, setAvailableWeapIds] = useState([]);
  const [availableSet1Ids, setAvailableSet1Ids] = useState([]);
  const [availableSet2Ids, setAvailableSet2Ids] = useState([]);
  
  // Theme and breakpoint
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Update availableCharIds after saving or deleting a character
  useEffect(() => {
    // Sort alphabetically
    const allCharIds = Object.keys(charData).sort();
    
    // Only include unused character ids
    const filteredCharIds = allCharIds.filter(
      (id) => !Object.keys(myChars).includes(id)
    );

    // Update state
    setAvailableCharIds(filteredCharIds);
  }, [myChars]);

  // Update availableWeapIds after selecting a character
  useEffect(() => {
    if (charData[newCharId]) {
      // Sort alphabetically
      const allWeapIds = Object.keys(weapData).sort();

      // Only include correct type weapon ids
      const filteredWeapIds = allWeapIds.filter(
        (id) => weapData[id].type === charData[newCharId].weapon
      );

      // Update state
      setAvailableWeapIds(filteredWeapIds);
    }
  }, [newCharId]);

  // Update availableSet1Ids after selecting a character
  useEffect(() => {
    if (charData[newCharId]) {
      // Sort alphabetically
      const allSetIds = Object.keys(setData).sort();

      // Only include set ids for relics
      const filteredSetIds = allSetIds.filter(
        (id) => setData[id].type === "Relic"
      );

      // Update state
      setAvailableSet1Ids(filteredSetIds);
    }
  }, [newCharId]);

  // Update availableSet2Ids after selecting a character
  useEffect(() => {
    if (charData[newCharId]) {
      // Sort alphabetically
      const allSetIds = Object.keys(setData).sort();

      // Only include set ids for planars
      const filteredSetIds = allSetIds.filter(
        (id) => setData[id].type === "Planar"
      );

      // Update state
      setAvailableSet2Ids(filteredSetIds);
    }
  }, [newCharId]);

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newCharObj.weapon.key) errors.push('Select light cone');
    if (!newCharObj.set1.key) errors.push('Select relic set');
    if (!newCharObj.set2.key) errors.push('Select planar set');

    // Display error message
    if (errors.length) {
      setError(errors.join(', '));
      return false;
    } else {
      setError('');
      return true;
    }
  };

  // Save button handler
  const handleSave = async () => {
    // Perform validation checks
    if (!validate()) return;

    // Calcuate and set score
    newCharObj.score = getScore(newCharId, newCharObj);

    // Save document to Firestore
    if (uid) {
      const charDocRef = doc(db, 'users', uid, 'HonkaiStarRail', newCharId);
      await setDoc(charDocRef, newCharObj, { merge: true });
    }

    // Save object to myChars
    setMyChars((prevChars) => ({
      ...prevChars,
      [newCharId]: newCharObj,
    }));

    // Reset states
    setError('');
    setNewCharId('');
    setNewCharObj(initCharObj());
    setIsSaveOpen(false);
  };

  // Cancel button handler
  const handleCancel = () => {
    // Reset states
    setError('');
    setNewCharId('');
    setNewCharObj(initCharObj());
    setIsSaveOpen(false);
  };

  return (
    <Modal open={isSaveOpen} onClose={handleCancel}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#1c1c1c',
          padding: 4,
          borderRadius: 2,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Buttons section */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}>
          {/* Icon */}
          {newCharId && (
            <img
              src={iconMedia[`../assets/icon/${newCharId}_Icon.webp`]?.default}
              alt={newCharObj.name || 'Icon'}
              style={{
                width: 50,
                height: 50,
                objectFit: 'contain',
              }}
            />
          )}

          {/* Select Character */}
          <Autocomplete
            size='small'
            value={newCharId}
            options={availableCharIds}
            onChange={(event, newValue) => {
              if (newValue) {
                setNewCharId(newValue);
                setNewCharObj({
                  ...initCharObj(),
                  name: charData[newValue].name,
                });
              } else {
                setNewCharId('');
                setNewCharObj(initCharObj());
              }
            }}
            getOptionLabel={(id) => charData[id]?.name || ''}
            isOptionEqualToValue={(option, value) => option === value}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Character"
              />
            )}
            sx={{ width: 320 }}
            disabled={isEditMode}
          />

          {/* Save button */}
          {newCharId && (
            <Button 
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ width: 80 }}
            >
              Save
            </Button>
          )}

          {/* Cancel button */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            sx={{ width: 80 }}
          >
            Cancel
          </Button>
          
          {/* Error section */}
          {error && (
            <Typography
              variant="body2"
              color="error"
            >
              {error}
            </Typography>
          )}
        </Box>

        {/* Data grid */}
        {newCharId && (
          <Grid container
            spacing={2}
            sx={{
              width: { xs: 256, md: 1280 },
              mt: 2,
            }}
          >
            {/* Select weapon */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                size='small'
                value={newCharObj.weapon.key}
                options={availableWeapIds}
                onChange={(event, newValue) => {
                  setNewCharObj((prev) => ({
                    ...prev,
                    weapon: {
                      key: newValue,
                      entry: weapData[newValue],
                    },
                  }));
                }}
                getOptionLabel={(id) => weapData[id]?.name || ''}
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Weapon"
                  />
                )}
                fullWidth
              />
            </Grid>

            {/* Select relic set */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                size='small'
                value={newCharObj.set1.key}
                options={availableSet1Ids}
                onChange={(event, newValue) => {
                  setNewCharObj((prev) => ({
                    ...prev,
                    set1: {
                      key: newValue,
                      entry: setData[newValue],
                    },
                  }));
                }}
                getOptionLabel={(id) => setData[id]?.name || ''}
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="4P Cavern Relics"
                  />
                )}
                fullWidth
              />
            </Grid>

            {/* Select planar set */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                size='small'
                value={newCharObj.set2.key}
                options={availableSet2Ids}
                onChange={(event, newValue) => {
                  setNewCharObj((prev) => ({
                    ...prev,
                    set2: {
                      key: newValue,
                      entry: setData[newValue],
                    },
                  }));
                }}
                getOptionLabel={(id) => setData[id]?.name || ''}
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="2P Planar Ornaments"
                  />
                )}
                fullWidth
              />
            </Grid>

            {/* Image */}
            <Grid size={{ xs: 12, md: 4 }}>
              {!isMobile && newCharObj.weapon.key && (
                <img
                  src={weaponMedia[`../assets/weapon/${newCharObj.weapon.key}.webp`]?.default}
                  alt={newCharObj.weapon.entry.name || 'Weapon'}
                  style={{
                    width: '100%',
                    height: 500,
                    objectFit: 'contain',
                  }}
                />
              )}
            </Grid>

            {/* Piece grid */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={2}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Grid size={{ xs: 12, md: 4 }} key={index}>
                    <Piece
                      index={index}
                      newCharObj={newCharObj}
                      setNewCharObj={setNewCharObj}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}

        
      </Box>      
    </Modal>
  );
};

export default Save;
