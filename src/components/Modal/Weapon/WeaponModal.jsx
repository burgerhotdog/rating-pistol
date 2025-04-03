import React, { useState } from "react";
import {
  Grid,
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
import { ASSETS, DATA } from "../../importData";
import DisplayCard from "./DisplayCard";

const WeaponModal = ({ gameId, pipe, setPipe, savePipe }) => {
  const { WEAPON_IMGS } = ASSETS[gameId];
  const { WEAPON_PREFIX, LEVEL_CAP, HEADERS, AVATAR_DATA, WEAPON_DATA } = DATA[gameId];
  const avatar = AVATAR_DATA[pipe.id];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // weaponId
  const weaponIdOptions = () => {
    return Object.keys(WEAPON_DATA)
      .filter(id => WEAPON_DATA[id].type === avatar.type)
      .sort((a, b) => {
        const sig = avatar.sig;
        if (a === sig) return -1;
        if (b === sig) return 1;
        const rarityA = WEAPON_DATA[a].rarity;
        const rarityB = WEAPON_DATA[b].rarity;
        return rarityA !== rarityB
          ? rarityB - rarityA
          : WEAPON_DATA[a].name.localeCompare(WEAPON_DATA[b].name);
      });
  };

  const weaponIdOptionLabel = (id) => {
    return WEAPON_DATA[id]?.name ?? "";
  }

  const handleWeaponId = (_, newValue) => {
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponId: newValue,
        weaponLevel: LEVEL_CAP,
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
        {option === avatar.sig && (
          <Typography sx={{ color: "text.disabled", ml: 1 }}>(signature)</Typography>
        )}
      </Box>
    );
  };

  // weaponLevel
  const handleWeaponLevel = (event) => {
    const newValue = event.target.value;
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponLevel: newValue,
      },
    }));
  };

  // weaponRank
  const weaponRankOptions = () => {
    const giNoRankOpt = gameId === "gi" && (
      pipe.data.weaponId === "11416" || // Kagotsurube Isshin
      pipe.data.weaponId === "15415" || // Predator
      pipe.data.weaponId === "11412" || // Sword of Descension
      pipe.data.weaponId === "15201" || // Seasoned Hunter's Bow
      pipe.data.weaponId === "14201" || // Pocket Grimoire
      pipe.data.weaponId === "13201" || // Iron Point
      pipe.data.weaponId === "12201" || // Old Merc's Pal
      pipe.data.weaponId === "11201" || // Silver Sword
      pipe.data.weaponId === "15101" || // Hunter's Bow
      pipe.data.weaponId === "14101" || // Apprentice's Notes
      pipe.data.weaponId === "13101" || // Beginner's Protector
      pipe.data.weaponId === "12101" || // Waster Greatsword
      pipe.data.weaponId === "11101" // Dull Blade
    );
    
    const noRankOpt = giNoRankOpt;

    return noRankOpt ? ["1"] : ["1", "2", "3", "4", "5"];
  };

  const weaponRankOptionLabel = (rank) => {
    return `${WEAPON_PREFIX}${rank}`;
  }

  const handleWeaponRank = (event) => {
    const newValue = event.target.value;
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponRank: newValue,
      },
    }));
  };

  // validate & save
  const validate = () => {
    // weaponId
    if (!pipe.data.weaponId) {
      setError("weaponId");
      return false;
    }

    // weaponLevel
    if (!/^[1-9]\d*$/.test(pipe.data.weaponLevel)) {
      setError("weaponLevel");
      return false;
    }
    const weaponLevel = Number(pipe.data.weaponLevel);
    if (weaponLevel < 1 || weaponLevel > LEVEL_CAP) {
      setError("weaponLevel");
      return false;
    }

    // weaponRank
    if (!pipe.data.weaponRank) {
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
      setPipe({});
    }
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Grid container spacing={2} width={700}>
        <Grid size="grow">
          <Autocomplete
            value={pipe.data.weaponId ?? ""}
            options={weaponIdOptions()}
            getOptionLabel={weaponIdOptionLabel}
            onChange={handleWeaponId}
            renderOption={renderOptionWeaponId}
            renderInput={(params) => (
              <TextField
                {...params}
                label={HEADERS.weapon}
                error={error === "weaponId"}
              />
            )}
          />
        </Grid>

        <Grid size="auto">
          <TextField
            value={pipe.data.weaponLevel ?? ""}
            label="Level"
            onChange={handleWeaponLevel}
            slotProps={{ htmlInput: { inputMode: "numeric" } }}
            sx={{ width: 75 }}
            error={error === "weaponLevel"}
            disabled={!pipe.data.weaponId}
          />
        </Grid>

        <Grid size="auto">
          <FormControl sx={{ width: 75 }} disabled={!pipe.data.weaponId}>
            <InputLabel id="weapon-rank-select" shrink>
              Rank
            </InputLabel>
            <Select
              labelId="weapon-rank-select"
              label="Rank"
              value={pipe.data.weaponRank ?? ""}
              onChange={handleWeaponRank}
              notched
            >
              {weaponRankOptions().map((rank) => (
                <MenuItem key={rank} value={rank}>
                  {weaponRankOptionLabel(rank)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={12}>
          <DisplayCard
            gameId={gameId}
            pipe={pipe}
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
