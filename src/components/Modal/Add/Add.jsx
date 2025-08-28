import { useState } from 'react';
import { Box, Stack, Autocomplete, TextField, Button } from '@mui/material';
import template from '@config/template';
import { AVATAR_ASSETS } from '@assets';
import { AVATAR_DATA } from '@data';

const Add = ({ gameId, avatarCache, saveAvatar, closeModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState(null);

  const charOptions = Object.keys(AVATAR_DATA[gameId])
    .filter(id => !Object.keys(avatarCache).includes(id))
    .sort((a, b) => {
      const A = AVATAR_DATA[gameId][a];
      const B = AVATAR_DATA[gameId][b];
      return A.rarity !== B.rarity
        ? B.rarity - A.rarity
        : A.name.localeCompare(B.name);
    });

  const handleSave = async () => {
    setIsLoading(true);
    const data = template(gameId);
    await saveAvatar(id, data);
    closeModal();
  };

  return (
    <Stack alignItems="center" gap={2}>
      <Autocomplete
        value={id}
        options={charOptions}
        getOptionLabel={(id) => AVATAR_DATA[gameId][id]?.name ?? ''}
        onChange={(_, newValue) => setId(newValue)}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          const rarity = AVATAR_DATA[gameId][option]?.rarity;
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
                src={AVATAR_ASSETS[gameId][option]}
                alt=""
                sx={{ width: 24, height: 24, objectFit: 'contain' }}
              />
              {AVATAR_DATA[gameId][option].name}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} label="Select" />
        )}
        sx={{ width: 250 }}
      />

      <Button
        onClick={handleSave}
        variant="contained"
        color="primary"
        loading={isLoading}
        disabled={!id}
      >
        Save
      </Button>
    </Stack>
  );
};

export default Add;
