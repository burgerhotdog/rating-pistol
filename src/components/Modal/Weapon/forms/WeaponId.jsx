import React from "react";
import { Box, Autocomplete, TextField, Typography } from "@mui/material";
import { WEAPON_ASSETS } from "@assets";
import { AVATARS, WEAPONS } from "@data";

const MAX_LEVEL = { gi: 90, hsr: 80, ww: 90, zzz: 60 };
const LABEL = { gi: "Weapon", hsr: "Light Cone", ww: "W-Engine", zzz: "Weapon" };

const WeaponId = ({ gameId, pipe, setPipe }) => {
  const { sig, type } = AVATARS[gameId][pipe.id];

  const weaponIdOptions = () => {
    return Object.keys(WEAPONS[gameId])
      .filter(id => WEAPONS[gameId][id].type === type)
      .sort((a, b) => {
        if (a === sig) return -1;
        if (b === sig) return 1;
        const rarityA = WEAPONS[gameId][a].rarity;
        const rarityB = WEAPONS[gameId][b].rarity;
        return rarityA !== rarityB
          ? rarityB - rarityA
          : WEAPONS[gameId][a].name.localeCompare(WEAPONS[gameId][b].name);
      });
  };

  const handleWeaponId = (newValue) => {
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponId: String(newValue),
        weaponLevel: MAX_LEVEL[gameId],
        weaponRank: 1,
      },
    }));
  };

  const renderOptionWeaponId = (props, option) => {
    const { key, ...optionProps } = props;
    const rarity = WEAPONS[gameId][option]?.rarity;
    return (
      <Box
        key={key}
        component="li"
        sx={{
          "& > img": { mr: 2, flexShrink: 0 },
          color: `rarityColor.${rarity}`,
        }}
        {...optionProps}
      >
        <Box
          component="img"
          loading="lazy"
          alt={""}
          src={WEAPON_ASSETS[`./${gameId}/${option}.webp`]?.default}
          sx={{ width: 24, height: 24, objectFit: "contain" }}
        />
        {WEAPONS[gameId][option]?.name}
        {option === sig && (
          <Typography sx={{ color: "text.disabled", ml: 1 }}>
            (signature)
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Autocomplete
      value={pipe.data.weaponId ?? ""}
      options={weaponIdOptions()}
      getOptionLabel={(id) => WEAPONS[gameId][id]?.name ?? ""}
      onChange={(_, newValue) => handleWeaponId(newValue)}
      renderOption={renderOptionWeaponId}
      renderInput={(params) => (
        <TextField
          {...params}
          label={LABEL[gameId]}
        />
      )}
      sx={{ flex: 1 }}
    />
  );
};

export default WeaponId;
