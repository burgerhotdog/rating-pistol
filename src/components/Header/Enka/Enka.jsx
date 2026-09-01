import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { useUser } from '@/contexts';
import { ZZZ } from '@/data';
import { fetchEnka } from './fetchEnka';
import SelectDialog from './SelectDialog';

const isValidUid = (gameId, uid) =>
  gameId === ZZZ
    ? /^\d{10,11}$/.test(uid)
    : /^\d{9,10}$/.test(uid);

const Enka = () => {
  const { gameId } = useParams();
  const { savedUids, updateSavedUids } = useUser();
  const [uid, setUid] = useState('');
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [charEnkas, setCharEnkas] = useState([]);

  useEffect(
    () => setUid(savedUids[gameId] ?? ''),
    [savedUids, gameId],
  );

  const handleSync = async () => {
    setIsSyncLoading(true);
    setError(null);

    try {
      const [status, result] = await fetchEnka(gameId, uid);

      if (status !== 200) {
        setError(result);
        return;
      }

      setCharEnkas(result);
      setDialogOpen(true);
      updateSavedUids(gameId, uid);
    } finally {
      setIsSyncLoading(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <TextField
        label="Enter UID..."
        value={uid}
        slotProps={{
          inputLabel: {
            shrink: false,
            sx: {
              opacity: uid ? 0 : 1,
              '&.Mui-focused': { color: 'text.secondary' },
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
                  onClick={handleSync}
                  disabled={isSyncLoading || !isValidUid(gameId, uid)}
                >
                  <SyncIcon
                    sx={{
                      '@keyframes spin': {
                        from: { transform: 'rotate(180deg)' },
                        to: { transform: 'rotate(0deg)' },
                      },
                      animation: isSyncLoading ? 'spin 1s ease-in-out infinite' : 'none',
                    }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        onChange={(e) => {
          if (error) setError(null);
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

      <SelectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        charEnkas={charEnkas}
      />
    </Box>
  );
};

export default Enka;
