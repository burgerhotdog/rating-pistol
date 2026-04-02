import { useEffect, useRef, useState } from 'react';
import { Autocomplete, Button, Dialog, DialogContent, DialogActions, DialogTitle, Box, Typography, TextField } from '@mui/material';
import { useBuild } from '@/contexts';
import { CHARACTERS } from '@/data';

const WUWA_DATA = CHARACTERS["wuthering-waves"];

const CHAR_OPTIONS = Object.keys(WUWA_DATA)
  .sort((a, b) => WUWA_DATA[a].name.localeCompare(WUWA_DATA[b].name));

const HeaderOcr = () => {
  const { saveBuildEntries } = useBuild();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../../workers/ocr.worker.js', import.meta.url),
      { type: 'module' }
    );
    return () => workerRef.current.terminate();
  }, []);

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedAvatarId(null);
    setError(null);
    setIsLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';

    setIsLoading(true);
    setError(null);

    createImageBitmap(file).then((imageBitmap) => {
      workerRef.current.postMessage({ imageBitmap }, [imageBitmap]);
    });

    workerRef.current.onmessage = ({ data }) => {
      const { success, build, error: workerError } = data;
      if (!success) {
        setError('Failed to process image. Please try again.');
        setIsLoading(false);
        return;
      }
      saveBuildEntries('wuthering-waves', [[selectedAvatarId, build]]);
      closeDialog();
    };

    workerRef.current.onerror = () => {
      setError('Failed to process image. Please try again.');
      setIsLoading(false);
    };
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <Button onClick={() => setDialogOpen(true)}>
        <Typography>Upload Image</Typography>
      </Button>

      <Dialog open={dialogOpen} onClose={closeDialog} disableRestoreFocus>
        <DialogTitle>Select Character to Import</DialogTitle>
        <DialogContent>
          <Autocomplete
            value={selectedAvatarId}
            options={CHAR_OPTIONS}
            getOptionLabel={(avatarId) => WUWA_DATA[avatarId]?.name ?? ''}
            onChange={(_, newValue) => setSelectedAvatarId(newValue)}
            renderOption={(props, optionId) => {
              const { key, ...optionProps } = props;
              const rarity = WUWA_DATA[optionId]?.RARITY;
              return (
                <Box
                  key={key}
                  component="li"
                  sx={{
                    '& > img': { mr: 2, flexShrink: 0 },
                    color: `rarityColor.${rarity}`,
                  }}
                  {...optionProps}
                >
                  <Box
                    component="img"
                    loading="lazy"
                    src={`${import.meta.env.BASE_URL}wuthering-waves/character/${optionId}.webp`}
                    alt=""
                    sx={{ width: 24, height: 24, objectFit: 'contain' }}
                  />
                  {WUWA_DATA[optionId].name}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField {...params} />
            )}
            sx={{ width: 250 }}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={isLoading}>Cancel</Button>
          <Button
            component="label"
            variant="contained"
            disabled={!selectedAvatarId}
            loading={isLoading}
          >
            Upload
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HeaderOcr;
