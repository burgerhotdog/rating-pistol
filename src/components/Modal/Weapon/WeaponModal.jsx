import React, { useState } from "react";
import {
  Grid2 as Grid,
  Stack,
  Box,
  Autocomplete,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import getData from "../../getData";
import getIcons from "../../getIcons";
import PreviewWeapon from "./PreviewWeapon";

const WeaponModal = ({
  gameId,
  modalPipe,
  setModalPipe,
  savePipe,
}) => {
  const { generalData, avatarData, weaponData } = getData[gameId];
  const { weaponIcons } = getIcons[gameId];
  const [isLoading, setIsLoading] = useState(false);

  const weapOptions = () => {
    return Object.keys(weaponData)
      .filter(id => weaponData[id].type === avatarData[modalPipe.id].type)
      .sort((a, b) => {
        const sig = avatarData[modalPipe.id]?.sig;
        if (a === sig) return -1;
        if (b === sig) return 1;
        const rarityA = weaponData[a].rarity;
        const rarityB = weaponData[b].rarity;
        return rarityA !== rarityB
          ? rarityB - rarityA
          : weaponData[a].name.localeCompare(weaponData[b].name);
      });
  };

  const weapRankOptions = () => {
    const giNoRankOpt = gameId === "gi" && (
      modalPipe.data.weaponId === "11416" || // Kagotsurube Isshin
      modalPipe.data.weaponId === "15415" || // Predator
      modalPipe.data.weaponId === "11412" || // Sword of Descension
      modalPipe.data.weaponId === "15201" || // Seasoned Hunter's Bow
      modalPipe.data.weaponId === "14201" || // Pocket Grimoire
      modalPipe.data.weaponId === "13201" || // Iron Point
      modalPipe.data.weaponId === "12201" || // Old Merc's Pal
      modalPipe.data.weaponId === "11201" || // Silver Sword
      modalPipe.data.weaponId === "15101" || // Hunter's Bow
      modalPipe.data.weaponId === "14101" || // Apprentice's Notes
      modalPipe.data.weaponId === "13101" || // Beginner's Protector
      modalPipe.data.weaponId === "12101" || // Waster Greatsword
      modalPipe.data.weaponId === "11101" // Dull Blade
    );
    
    const noRankOpt = giNoRankOpt;

    return noRankOpt ? [1] : [1, 2, 3, 4, 5];
  };

  const handleWeaponId = (newValue) => {
    setModalPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponId: newValue,
        weaponLevel: newValue ? generalData.LEVEL_CAP : null,
        weaponRank: newValue ? 1 : null,
      },
    }));
  };

  const handleWeaponLevel = (newValue) => {
    setModalPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponLevel: newValue,
      },
    }));
  };

  const handleWeaponRank = (newValue) => {
    setModalPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponRank: newValue,
      },
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    await savePipe();
    
    setModalPipe({});
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Grid container spacing={2} width={700}>
        <Grid size="grow">
          <Autocomplete
            value={modalPipe.data.weaponId}
            options={weapOptions()}
            getOptionLabel={(option) => weaponData[option]?.name || ""}
            onChange={(_, newValue) => handleWeaponId(newValue)}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              const rarity = weaponData[option]?.rarity;
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
                    src={weaponIcons[`./${option}.webp`]?.default}
                    sx={{ width: 25, height: 25, objectFit: "contain" }}
                  />
                  {weaponData[option]?.name}
                  {option === avatarData[modalPipe.id]?.sig && (
                    <Typography sx={{ color: "text.disabled", ml: 1 }}>(signature)</Typography>
                  )}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={generalData.SECTIONS[1]}
              />
            )}
          />
        </Grid>

        <Grid size="auto">
          <Autocomplete
            value={modalPipe?.data.weaponLevel}
            options={Array.from({ length: generalData.LEVEL_CAP / 10 }, (_, i) => (generalData.LEVEL_CAP - i * 10).toString())}
            getOptionLabel={(id) => id.toString() || ""}
            onChange={(_, newValue) => {
              if (newValue) handleWeaponLevel(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Level"
              />
            )}
            disabled={!modalPipe.data.weaponId}
          />
        </Grid>

        <Grid size="auto">
          <Autocomplete
            value={modalPipe.data.weaponRank}
            options={weapRankOptions()}
            getOptionLabel={(opt) => `${generalData.WEAPON_RANK_PREFIX}${opt}`}
            onChange={(_, newValue) => {
              if (newValue) handleWeaponRank(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Rank"
              />
            )}
            disabled={!modalPipe.data.weaponId}
          />
        </Grid>

        <Grid size={12}>
          <PreviewWeapon
            gameId={gameId}
            modalPipe={modalPipe}
          />
        </Grid>
      </Grid>

      <Button
        onClick={handleSave}
        loading={isLoading}
        variant="contained"
      >
        Save
      </Button>
    </Stack>
  );
};

export default WeaponModal;
