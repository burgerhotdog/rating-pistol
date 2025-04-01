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
import getData from "../../getData";
import getImgs from "../../getImgs";
import DisplayCard from "./DisplayCard";

const WeaponModal = ({
  gameId,
  modalPipe,
  setModalPipe,
  savePipe,
}) => {
  const { WEAPON_PREFIX, LEVEL_CAP, HEADERS, AVATAR_DATA, WEAPON_DATA } = getData[gameId];
  const avatar = AVATAR_DATA[modalPipe.id];
  const { WEAPON_IMGS } = getImgs[gameId];
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
    setModalPipe((prev) => ({
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

  const weaponRankOptionLabel = (rank) => {
    return `${WEAPON_PREFIX}${rank}`;
  }

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

  // validate & save
  const validate = () => {
    // weaponId
    if (!modalPipe.data.weaponId) {
      setError("weaponId");
      return false;
    }

    // weaponLevel
    if (!/^[1-9]\d*$/.test(modalPipe.data.weaponLevel)) {
      setError("weaponLevel");
      return false;
    }
    const weaponLevel = Number(modalPipe.data.weaponLevel);
    if (weaponLevel < 1 || weaponLevel > LEVEL_CAP) {
      setError("weaponLevel");
      return false;
    }

    // weaponRank
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
            value={modalPipe.data.weaponId ?? ""}
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
            <InputLabel id="weapon-rank-select" shrink>
              Rank
            </InputLabel>
            <Select
              labelId="weapon-rank-select"
              label="Rank"
              value={modalPipe.data.weaponRank ?? ""}
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
