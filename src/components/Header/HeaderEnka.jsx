import { useContext, useEffect, useState } from 'react';
import { Checkbox, Button, Dialog, DialogContent, DialogActions, DialogTitle, FormControlLabel, Box, Typography, IconButton, TextField, InputAdornment } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { UserDataContext, BuildDataContext } from '@/contexts';
import { fetchEnka, parseEnkaObj } from './enkaHelpers';
import { ALL_CHARACTER_LOOKUP } from '@/lookups';

const HeaderEnka = ({ activeGameId }) => {
  const { savedUids, updateSavedUids } = useContext(UserDataContext);
  const { saveBuildEntries } = useContext(BuildDataContext);
  const [uid, setUid] = useState('');
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [enkaList, setEnkaList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);

  useEffect(() => {
    setUid(savedUids[activeGameId] ?? '');
  }, [savedUids, activeGameId]);

  const isValidLength = (gameId, input) => {
    if (gameId === 'genshin-impact' || gameId === 'honkai-star-rail') {
      return /^\d{9,10}$/.test(input);
    }
    if (gameId === 'zenless-zone-zero') {
      return /^\d{10,11}$/.test(input);
    }
    return false;
  };

  const handleSync = async () => {
    setIsSyncLoading(true);
    setError(null);
    const [status, result] = await fetchEnka(activeGameId, uid);
    if (status !== 200) {
      setError(result);
      setIsSyncLoading(false);
      return;
    } else {
      setEnkaList(result);
      setSelectedList(result.map(() => true));
      setDialogOpen(true);
      updateSavedUids(activeGameId, uid);
      setIsSyncLoading(false);
    }
  };

  const handleSave = async () => {
    const charBuffer = selectedList.map((verdict, index) => {
      if (!verdict) return null;
      return parseEnkaObj(activeGameId, enkaList[index]);
    }).filter(Boolean);

    if (charBuffer.length) {
      saveBuildEntries(activeGameId, charBuffer);
    }

    closeDialog();
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleDialogExited = () => {
    setSelectedList([]);
    setEnkaList([]);
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <TextField
        label="Enter UID..."
        size="small"
        value={uid}
        slotProps={{
          inputLabel: {
            shrink: false,
            sx: {
              opacity: uid ? 0 : 1,
              '&.Mui-focused': {
                color: 'text.secondary',
              },
            },
          },
          input: {
            inputMode: 'numeric',
            onBeforeInput: (e) => {
              if (!/^\d*$/.test(e.data)) {
                e.preventDefault();
              }
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleSync()}
                  disabled={!isValidLength(activeGameId, uid) || isSyncLoading}
                >
                  <SyncIcon
                    sx={{
                      '@keyframes spin': {
                        from: {
                          transform: 'rotate(180deg)',
                        },
                        to: {
                          transform: 'rotate(0deg)',
                        },
                      },
                      animation: isSyncLoading
                        ? 'spin 1s ease-in-out infinite'
                        : 'none',
                    }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        onChange={(e) => {
          if (error) {
            setError(null);
          }
          setUid(e.target.value);
        }}
        error={!!error}
        disabled={isSyncLoading}
      />

      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{
            position: 'absolute',
            bottom: '-1.5rem',
            left: '14px',
            pointerEvents: 'none',
          }}
        >
          {error}
        </Typography>
      )}

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        slotProps={{
          transition: {
            onExited: handleDialogExited,
          },
        }}
      >
        <DialogTitle>Select Characters to Import</DialogTitle>
        <DialogContent>
          {enkaList.map((char, index) => (
            <FormControlLabel
              key={char.avatarId}
              control={
                <Checkbox
                  checked={selectedList[index]}
                  onChange={() => setSelectedList(prev => {
                    const newSelected = [...prev];
                    newSelected[index] = !newSelected[index];
                    return newSelected;
                  })}
                />
              }
              label={ALL_CHARACTER_LOOKUP[activeGameId][char.avatarId].name}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HeaderEnka;
