import { useMemo } from 'react';
import { Box, Autocomplete, TextField, Typography, Paper } from '@mui/material';
import { WEAPON_ASSETS } from '@assets';
import { AVATAR_DATA, WEAPON_DATA } from '@data';

const WeaponId = ({ gameId, id, weaponId, setWeaponId }) => {
  const { sig, type } = AVATAR_DATA[gameId][id];

  const weaponIdOptions = useMemo(() =>
    Object.keys(WEAPON_DATA[gameId]).map(Number)
      .filter(weapon => WEAPON_DATA[gameId][weapon].type === type)
      .sort((a, b) => {
        if (a === sig) return -1;
        if (b === sig) return 1;
        const rarityA = WEAPON_DATA[gameId][a].rarity;
        const rarityB = WEAPON_DATA[gameId][b].rarity;
        return rarityA !== rarityB
          ? rarityB - rarityA
          : WEAPON_DATA[gameId][a].name.localeCompare(WEAPON_DATA[gameId][b].name);
      }), []);

  const handleWeaponId = (newValue) => {
    setWeaponId(newValue);
  };

  const renderOptionWeaponId = (props, option) => {
    const { key, ...optionProps } = props;
    const rarity = WEAPON_DATA[gameId][option]?.rarity;
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
          alt=""
          src={WEAPON_ASSETS[gameId][option]}
          sx={{ width: 24, height: 24, objectFit: 'contain' }}
        />
        {WEAPON_DATA[gameId][option]?.name}
        {option === sig && (
          <Typography sx={{ color: 'text.disabled', ml: 1 }}>
            (signature)
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Autocomplete
      value={weaponId}
      options={weaponIdOptions}
      getOptionLabel={(id) => WEAPON_DATA[gameId][id]?.name ?? ''}
      onChange={(_, newValue) => handleWeaponId(newValue)}
      renderOption={renderOptionWeaponId}
      renderInput={(params) => (
        <TextField {...params} label="Weapon" />
      )}
      slots={{
        paper: ({ children }) => (
          <Paper elevation={3}>
            {children}
          </Paper>
        )
      }}
      fullWidth
    />
  );
};

export default WeaponId;
