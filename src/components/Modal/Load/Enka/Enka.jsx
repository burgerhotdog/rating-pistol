import { useEffect, useState } from 'react';
import { Box, Stack, Button, FormControlLabel, Checkbox, TextField, Typography } from '@mui/material';
import { fbGetUser, fbSetUser } from '@/firebase';
import { AVATAR_ASSETS } from '@assets';
import { AVATAR_DATA } from '@data';
import fetchEnka from './fetchEnka';
import parseEnkaObj from './parseEnkaObj';

const Enka = ({ gameId, userId, saveAvatarBatch, closeModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uid, setUid] = useState(null);
  const [remUid, setRemUid] = useState(false);
  const [enkaList, setEnkaList] = useState([]);
  const [selected, setSelected] = useState([]);

  // initialize uid on mount
  useEffect(() => {
    const initUid = async () => {
      const snapshot = await fbGetUser(userId);
      if (!snapshot) return;

      const savedUid = snapshot.data()?.[`${gameId}_uid`];
      if (!savedUid) return;

      setUid(savedUid);
      setRemUid(true);
    };

    if (userId) initUid();
  }, [userId, gameId]);

  // Select all characters by default when enkaList is populated
  useEffect(() => {
    if (enkaList.length > 0) setSelected(enkaList.map((_, index) => index));
  }, [enkaList]);

  const handleNext = async () => {
    setError(null);
    setIsLoading(true);
    const response = await fetchEnka(gameId, uid);
    if (Array.isArray(response)) {
      // save uid if checked
      if (userId && remUid) fbSetUser(userId, `${gameId}_uid`, uid);
      setEnkaList(response);
    } else {
      setError(response);
    }
    setIsLoading(false);
  };

  const handleCharacterToggle = (event, index) => {
    setSelected(prevSelected => {
      if (event.target.checked) {
        return [...prevSelected, index];
      } else {
        return prevSelected.filter((id) => id !== index);
      }
    });
  };

  const handleSaveCharacters = async () => {
    setIsLoading(true);
    const charBuffer = selected.map(selectedIndex => {
      return parseEnkaObj(gameId, enkaList[selectedIndex]);
    });
    if (charBuffer.length) saveAvatarBatch(charBuffer);
    closeModal();
  };

  // Render UID input form
  if (!enkaList.length) {
    return (
      <Stack alignItems="center" gap={2}>
        <Stack>
          <TextField
            type="number"
            label="Enter UID"
            value={uid ?? ''}
            onChange={(e) => {
              setUid(e.target.value === '' ? null : Number(e.target.value));
            }}
            error={!!error}
            helperText={error}
          />

          <Box display="flex" alignItems="center">
            <Checkbox
              onChange={() => setRemUid(!remUid)}
              checked={remUid}
              disabled={!userId}
            />
            <Typography variant="body2" color="text.secondary">
              Remember UID (requires sign-in)
            </Typography>
          </Box>
        </Stack>

        <Button 
          onClick={handleNext} 
          variant="contained" 
          loading={isLoading}
        >
          Next
        </Button>
      </Stack>
    );
  }

  // Render character selection form
  return (
    <Stack alignItems="center" gap={2}>
      <Stack>
        <Typography variant="subtitle1">
          Select characters to add.
        </Typography>

        {enkaList.map((avatar, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                onChange={(e) => handleCharacterToggle(e, index)}
                checked={selected.includes(index)}
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  component="img"
                  loading="lazy"
                  src={AVATAR_ASSETS[gameId][avatar.avatarId]}
                  alt={avatar.avatarId}
                  sx={{ width: 24, height: 24, objectFit: 'contain' }}
                />
                <Typography variant="body2">
                  {AVATAR_DATA[gameId][avatar.avatarId].name}
                </Typography>
              </Box>
            }
            onClick={(e) => e.stopPropagation()}
          />
        ))}
      </Stack>
      
      <Button 
        onClick={handleSaveCharacters} 
        loading={isLoading} 
        variant="contained"
      >
        Save
      </Button>
    </Stack>
  );
};

export default Enka;
