import React, { useState } from "react";
import {
  Grid2 as Grid,
  Stack,
  Box,
  Autocomplete,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import getData from "../../getData";
import getIcons from "../../getIcons";
import DisplayCard from "./DisplayCard";

const WeaponModal = ({
  gameId,
  modalPipe,
  setModalPipe,
  savePipe,
}) => {
  const { generalData, avatarData, weaponData } = getData[gameId];
  const { SECTIONS, LEVEL_CAP, WEAPON_RANK_PREFIX } = generalData;
  const avatar = avatarData[modalPipe.id];
  const { weaponIcons } = getIcons[gameId];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const weaponIdOptions = () => {
    return Object.keys(weaponData)
      .filter(id => weaponData[id].type === avatar.type)
      .sort((a, b) => {
        const sig = avatar.sig;
        if (a === sig) return -1;
        if (b === sig) return 1;
        const rarityA = weaponData[a].rarity;
        const rarityB = weaponData[b].rarity;
        return rarityA !== rarityB
          ? rarityB - rarityA
          : weaponData[a].name.localeCompare(weaponData[b].name);
      });
  };

  const weaponRankOptions = () => {
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

    return noRankOpt ? ["1"] : ["1", "2", "3", "4", "5"];
  };

  const addRankPrefix = (rank) => {
    return `${WEAPON_RANK_PREFIX}${rank}`;
  }

  const handleWeaponId = (_, newValue) => {
    setModalPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponId: newValue,
        weaponLevel: LEVEL_CAP,
        weaponRank: 1,
      },
    }));
  };

  const handleWeaponLevel = (event) => {
    const newValue = event.target.value;
    setModalPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponLevel: newValue,
      },
    }));
  };

  const handleWeaponRank = (event) => {
    const newValue = event.target.value;
    setModalPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponRank: newValue,
      },
    }));
  };

  const validate = () => {
    // validate weaponId
    if (!modalPipe.data.weaponId) {
      setError("weaponId");
      return false;
    }

    // validate weaponLevel
    if (!/^[1-9]\d*$/.test(modalPipe.data.weaponLevel)) {
      setError("weaponLevel");
      return false;
    }
    const weaponLevel = Number(modalPipe.data.weaponLevel);
    if (weaponLevel < 1 || weaponLevel > LEVEL_CAP) {
      setError("weaponLevel");
      return false;
    }

    // validate weaponRank
    if (!modalPipe.data.weaponRank) {
      setError("weaponRank");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (validate()) {
      setIsLoading(true);
      await savePipe();
      setModalPipe({});
    }
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Grid container spacing={2} width={700}>
        <Grid size="grow">
          <Autocomplete
            value={modalPipe.data.weaponId}
            options={weaponIdOptions()}
            getOptionLabel={(option) => weaponData[option]?.name ?? ""}
            onChange={handleWeaponId}
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
                  {option === avatar.sig && (
                    <Typography sx={{ color: "text.disabled", ml: 1 }}>(signature)</Typography>
                  )}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={SECTIONS[1]}
                error={error === "weaponId"}
              />
            )}
          />
        </Grid>

        <Grid size="auto">
          <TextField
            value={modalPipe.data.weaponLevel ?? ""}
            label="Level"
            onChange={handleWeaponLevel}
            slotProps={{ htmlInput: { inputMode: "numeric" } }}
            sx={{ width: 75 }}
            error={error === "weaponLevel"}
            disabled={!modalPipe.data.weaponId}
          />
        </Grid>

        <Grid size="auto">
          <FormControl sx={{ width: 75 }} disabled={!modalPipe.data.weaponId}>
            <InputLabel id="weapon-rank-select" shrink>Rank</InputLabel>
            <Select
              labelId="weapon-rank-select"
              label="Rank"
              value={modalPipe.data.weaponRank ?? ""}
              onChange={handleWeaponRank}
            >
              {weaponRankOptions().map((rank) => (
                <MenuItem key={rank} value={rank}>
                  {addRankPrefix(rank)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={12}>
          <DisplayCard
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
