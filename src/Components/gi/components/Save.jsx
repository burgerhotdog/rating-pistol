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
import SlotCard from './SlotCard';
import initCharObj from './initCharObj';
import charData from '../data/charData';
import weapData from '../data/weapData';
import setData from '../data/setData';
import getScore from './getScore';

const images = import.meta.glob('../../../assets/gi/splash/*.webp', { eager: true });

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
  const [availableSetIds, setAvailableSetIds] = useState([]);
  
  // Theme and breakpoint
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'));

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

  // Update availableSetIds after selecting a character
  useEffect(() => {
    if (charData[newCharId]) {
      // Sort alphabetically
      const allSetIds = Object.keys(setData).sort();

      // Update state
      setAvailableSetIds(allSetIds);
    }
  }, [newCharId]);

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newCharObj.weapon.key) errors.push('Select weapon');
    if (!newCharObj.set.key) errors.push('Select artifact set');

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
      const charDocRef = doc(db, 'users', uid, 'GenshinImpact', newCharId);
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
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#1c1c1c',
        padding: 4,
        borderRadius: 2,
        ...(newCharId && {
          maxHeight: '80vh',
          overflowY: 'auto',
        }),
      }}>        
        {/* Data grid */}
        {newCharId ? (
          <Grid container spacing={2} sx={{ width: { xs: 256, sm: 1024 } }}>
            {/* Select character */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <Autocomplete
                disablePortal
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
                getOptionLabel={(id) => charData[id]?.name}
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => <TextField {...params} label="Character" />}
                fullWidth
                disabled={isEditMode}
              />
            </Grid>

            {/* Select weapon */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <Autocomplete
                disablePortal
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
                renderInput={(params) => <TextField {...params} label="Weapon" />}
                fullWidth
              />
            </Grid>

            {/* Select artifact set */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                disablePortal
                size='small'
                value={newCharObj.set.key}
                options={availableSetIds}
                onChange={(event, newValue) => {
                  setNewCharObj((prev) => ({
                    ...prev,
                    set: {
                      key: newValue,
                      entry: setData[newValue],
                    },
                  }));
                }}
                getOptionLabel={(id) => setData[id]?.name || ''}
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => <TextField {...params} label="Artifact Set" />}
                fullWidth
              />
            </Grid>

            {/* Image */}
            <Grid size={{ xs: 12, sm: 6 }}>
              {!isMobile && (
                <img
                  src={images[`../../../assets/gi/splash/${newCharId}.webp`]?.default}
                  alt={newCharObj.name || 'Character Splash'}
                  style={{
                    width: '100%',
                    height: 500,
                    objectFit: 'contain',
                  }}
                />
              )}
            </Grid>

            {/* Artifact grid */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Grid container spacing={2}>
                {['Flower', 'Plume', 'Sands', 'Goblet', 'Circlet'].map(
                  (slotName, index) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={slotName}>
                      <SlotCard
                        slotName={slotName}
                        slotIndex={index}
                        newCharId={newCharId}
                        newCharObj={newCharObj}
                        setNewCharObj={setNewCharObj}
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
            renderInput={(params) => <TextField {...params} label="Select" />}
            sx={{ width: 240 }}
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
            sx={{ width: 80 }}
            disabled={!newCharId}
          >
            Save
          </Button>
        </Box>
      </Box>      
    </Modal>
  );
};

export default Save;
