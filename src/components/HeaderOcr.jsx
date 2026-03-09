import { useContext, useState } from 'react';
import { Autocomplete, Button, Dialog, DialogContent, DialogActions, DialogTitle, Box, Typography, TextField } from '@mui/material';
import { BuildDataContext } from '@/contexts';
import { AVATAR_DATA } from '@/data';
import { AVATAR_ASSETS } from '@/assets';

const WUWA_DATA = AVATAR_DATA['wuthering-waves'];
const WUWA_ASSETS = AVATAR_ASSETS['wuthering-waves'];

const CHAR_OPTIONS = Object.keys(WUWA_DATA)
  .sort((a, b) => WUWA_DATA[a].name.localeCompare(WUWA_DATA[b].name));

const HeaderOcr = () => {
  const { saveBuildEntries } = useContext(BuildDataContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

    const formData = new FormData();
    formData.append('file', file);

    fetch('https://rating-pistol-be-6a62d70a6b2f.herokuapp.com/ocr/', {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then(({ data }) => {
        saveBuildEntries('wuthering-waves', [[selectedAvatarId, data]]);
        closeDialog();
      })
      .catch((err) => {
        console.error('Error uploading image:', err);
        setError('Failed to process image. Please try again.');
        setIsLoading(false);
      });
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
              const rarity = WUWA_DATA[optionId]?.rarity;
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
                    src={WUWA_ASSETS[optionId]}
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
