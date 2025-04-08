import React from "react";
import { Box, Autocomplete, TextField, Typography } from "@mui/material";
import WEAPON_ASSETS from "@assets/weapon";
import WEAPON_DATA from "@data/weapon";
import AVATAR_DATA from "@data/avatar";

const MAX_LEVEL = { gi: 90, hsr: 80, ww: 90, zzz: 60 };
const LABEL = { gi: "Weapon", hsr: "Light Cone", ww: "W-Engine", zzz: "Weapon" };

const WeaponId = ({ gameId, pipe, setPipe }) => {
  const { sig, type } = AVATAR_DATA[gameId][pipe.id];

  const weaponIdOptions = () => {
    return Object.keys(WEAPON_DATA[gameId])
      .filter(id => WEAPON_DATA[gameId][id].type === type)
      .sort((a, b) => {
        if (a === sig) return -1;
        if (b === sig) return 1;
        const rarityA = WEAPON_DATA[gameId][a].rarity;
        const rarityB = WEAPON_DATA[gameId][b].rarity;
        return rarityA !== rarityB
          ? rarityB - rarityA
          : WEAPON_DATA[gameId][a].name.localeCompare(WEAPON_DATA[gameId][b].name);
      });
  };

  const handleWeaponId = (_, newValue) => {
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponId: newValue,
        weaponLevel: MAX_LEVEL[gameId],
        weaponRank: 1,
      },
    }));
  };

  const renderOptionWeaponId = (props, option) => {
    const { key, ...optionProps } = props;
    const rarity = WEAPON_DATA[gameId][option]?.rarity;
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
        {WEAPON_DATA[gameId][option]?.name}
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
      getOptionLabel={(id) => WEAPON_DATA[gameId][id]?.name ?? ""}
      onChange={handleWeaponId}
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
