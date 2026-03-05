import { useContext, useEffect, useState } from 'react';
import { Box, Typography, IconButton, TextField, InputAdornment } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { UserDataContext } from '@contexts';

const HeaderEnka= ({ activeGameId }) => {
  const { savedUids, updateSavedUids } = useContext(UserDataContext);
  const [uid, setUid] = useState('');
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSync = () => {
    setIsSyncLoading(true);
    setTimeout(() => {
      console.log('Waited 5 seconds');
      updateSavedUids(activeGameId, uid);
      setIsSyncLoading(false);
    }, 5000);
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
    </Box>
  )
};

export default HeaderEnka;
