import React from "react";
import { Box, Autocomplete, TextField, Typography } from "@mui/material";
import { ASSETS, DATA } from "../../../importData";

const MAX_LEVEL = { gi: 90, hsr: 80, ww: 90, zzz: 60 };
const LABEL = { gi: "Weapon", hsr: "Light Cone", ww: "W-Engine", zzz: "Weapon" };

const WeaponId = ({ gameId, pipe, setPipe }) => {
  const { WEAPON_IMGS } = ASSETS[gameId];
  const { AVATAR_DATA, WEAPON_DATA } = DATA[gameId];
  const { sig, type } = AVATAR_DATA[pipe.id];

  const weaponIdOptions = () => {
    return Object.keys(WEAPON_DATA)
      .filter(id => WEAPON_DATA[id].type === type)
      .sort((a, b) => {
        if (a === sig) return -1;
        if (b === sig) return 1;
        const rarityA = WEAPON_DATA[a].rarity;
        const rarityB = WEAPON_DATA[b].rarity;
        return rarityA !== rarityB
          ? rarityB - rarityA
          : WEAPON_DATA[a].name.localeCompare(WEAPON_DATA[b].name);
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
    const rarity = WEAPON_DATA[option]?.rarity;
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
          src={WEAPON_IMGS[`./${option}.webp`]?.default}
          sx={{ width: 24, height: 24, objectFit: "contain" }}
        />
        {WEAPON_DATA[option]?.name}
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
      getOptionLabel={(id) => WEAPON_DATA[id]?.name ?? ""}
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
