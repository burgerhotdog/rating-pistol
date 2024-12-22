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
import initCharObj from './initCharObj';
import charData from '../data/charData';
import weapData from '../data/weapData';
import setData from '../data/setData';

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

  // Update availableCharIds when myChars changes
  useEffect(() => {
    // Filter out used character ids
    const allCharIds = Object.keys(charData).sort();
    const filteredCharIds = allCharIds.filter(
      (id) => !Object.keys(myChars).includes(id)
    );

    // Sort by rarity
    filteredCharIds.sort((a, b) => {
      const rarityA = charData[a]?.rarity || '';
      const rarityB = charData[b]?.rarity || '';
      return rarityB.localeCompare(rarityA);
    });

    // Update state
    setAvailableCharIds(filteredCharIds);
  }, [myChars]);

  // Update availableWeapIds when newCharId changes
  useEffect(() => {
    if (charData[newCharId]) {
      // Filter out weapon ids with wrong type
      const allWeapIds = Object.keys(weapData).sort();
      const filteredWeapIds = allWeapIds.filter(
        (id) => charData[newCharId].weapType === weapData[id].type
      );

      // Sort by rarity
      filteredWeapIds.sort((a, b) => {
        const rarityA = weapData[a]?.rarity || '';
        const rarityB = weapData[b]?.rarity || '';
        return rarityB.localeCompare(rarityA);
      });

      // Update state
      setAvailableWeapIds(filteredWeapIds);
    }
  }, [newCharId]);

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newCharObj.weapId) errors.push('No weapon selected');
    if (!newCharObj.set) errors.push('No artifact set selected');

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

    // Save document to Firestore
    if (uid) {
      const charDocRef = doc(db, 'users', uid, 'GenshinImpact', newCharId);
      await setDoc(charDocRef, newCharObj, { merge: true });
    }

    // Save obj to myChars
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
        {newCharId ? (
          <Grid container spacing={2} sx={{ width: 1024 }}>
            {/* Select character */}
            <Grid size={3}>
              <Autocomplete
                disablePortal
                size='small'
                value={newCharId}
                options={availableCharIds}
                groupBy={(option) => charData[option].rarity}
                onChange={(event, newValue) => {
                  if (newValue) {
                    // If character selected:
                    setNewCharId(newValue);
                    setNewCharObj({
                      ...initCharObj(),
                      name: charData[newValue].name,
                    });
                  } else {
                    // If no character selected:
                    setNewCharId('');
                    setNewCharObj(initCharObj());
                  }
                }}
                getOptionLabel={(id) => charData[id]?.name}
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => <TextField {...params} label="Character" />}
                renderGroup={(params) => (
                  <div key={params.group}>
                    <strong style={{ padding: '8px' }}>{params.group}</strong>
                    <div>{params.children}</div>
                  </div>
                )}
                fullWidth
                disabled={isEditMode}
              />
            </Grid>

            {/* Select weapon */}
            <Grid size={3}>
              <Autocomplete
                disablePortal
                size='small'
                value={newCharObj.weapId}
                options={availableWeapIds}
                groupBy={(option) => weapData[option].rarity}
                onChange={(event, newValue) => {
                  setNewCharObj((prev) => ({
                    ...prev,
                    weapId: newValue,
                  }));
                }}
                getOptionLabel={(id) => weapData[id]?.name || ''}
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => <TextField {...params} label="Weapon" />}
                renderGroup={(params) => (
                  <div key={params.group}>
                    <strong style={{ padding: '8px' }}>{params.group}</strong>
                    <div>{params.children}</div>
                  </div>
                )}
                fullWidth
              />
            </Grid>

            {/* Select artifact set */}
            <Grid size={6}>
              <Autocomplete
                disablePortal
                size='small'
                value={newCharObj.set}
                options={setData}
                fullWidth
                onChange={(event, newValue) => {
                  setNewCharObj((prev) => ({
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
                src={images[`../../../assets/gi/splash/${newCharId}.webp`]?.default}
                alt={newCharObj.name || 'Character Splash'}
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
            groupBy={(option) => charData[option].rarity}
            onChange={(event, newValue) => {
              if (newValue) {
                // If character selected:
                setNewCharId(newValue);
                setNewCharObj({
                  ...initCharObj(),
                  name: charData[newValue].name,
                });
              } else {
                // If no character selected:
                setNewCharId('');
                setNewCharObj(initCharObj());
              }
            }}
            getOptionLabel={(id) => charData[id]?.name || ''}
            isOptionEqualToValue={(option, value) => option === value}
            renderInput={(params) => <TextField {...params} label="Select" />}
            renderGroup={(params) => (
              <div key={params.group}>
                <strong style={{ padding: '8px' }}>{params.group}</strong>
                <div>{params.children}</div>
              </div>
            )}
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
