import React from "react";
import Grid from "@mui/material/Grid2";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  InputAdornment,
  Stack,
  Slider,
  TextField,
  Typography,
} from "@mui/material";

const ModalEditWeapon = ({
  gameType,
  gameData,
  gameIcons,
  action,
  setAction,
}) => {
  const { CHAR, WEAP } = gameData;
  const { weapIcons } = gameIcons;
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };
  const levelCapRegex =
    gameType === "GI" ? /^(?:[1-9]|[1-8][0-9]|90)?$/ :
    gameType === "HSR" ? /^(?:[1-9]|[1-7][0-9]|80)?$/ :
    gameType === "WW" ? /^(?:[1-9]|[1-8][0-9]|90)?$/ :
    gameType === "ZZZ" && /^(?:[1-9]|[1-5][0-9]|60)?$/;

  const weapOptions = () => {
    return Object.keys(WEAP)
      .filter(id => WEAP[id].type === CHAR[action.id]?.type)
      .sort((a, b) => {
        const rarityA = WEAP[a].rarity;
        const rarityB = WEAP[b].rarity;
        return rarityA !== rarityB ? 
          rarityB - rarityA : 
          WEAP[a].name.localeCompare(WEAP[b].name);
      });
  };

  const handleWeapon = (newValue) => {
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        info: {
          ...prev.data.info,
          weapon: newValue || "",
          weaponLevel: "1",
          weaponRank: "1",
        }
      },
    }));
  };

  const handleWeaponLevel = (newValue) => {
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        info: {
          ...prev.data.info,
          weaponLevel: newValue || "",
        }
      },
    }));
  };

  const handleWeaponRank = (newValue) => {
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        info: {
          ...prev.data.info,
          weaponRank: newValue || "",
        }
      },
    }));
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Autocomplete
          size="small"
          value={action?.data?.info?.weapon || ""}
          options={weapOptions()}
          getOptionLabel={(id) => WEAP[id]?.name || ""}
          onChange={(_, newValue) => handleWeapon(newValue)}
          renderOption={(props, id) => {
            const { key, ...idProps } = props;
            const rarity = WEAP[id]?.rarity;
            return (
              <Box
                key={key}
                component="li"
                sx={{
                  "& > img": { mr: 2, flexShrink: 0 },
                  color: rarityColor[rarity],
                }}
                {...idProps}
              >
                <Box
                  component="img"
                  loading="lazy"
                  src={weapIcons[`../assets/weap/${gameType}/${id}.webp`]?.default}
                  alt={""}
                  sx={{ width: 24, height: 24, objectFit: "contain" }}
                />
                {WEAP[id]?.name || ""}
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Weapon"
              sx={{
                "& .MuiInputBase-root": {
                  color: rarityColor[WEAP[action?.data?.info?.weapon]?.rarity] || "inherit",
                }
              }}
            />
          )}
          fullWidth
          sx={{ minWidth: 350 }}
          disableClearable={action?.data?.info?.weapon === ""}
        />
        {action?.data?.info?.weapon && (
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              label="Level"
              value={action?.data?.info?.weaponLevel || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                const isValid = levelCapRegex.test(newValue);
                if (isValid) handleWeaponLevel(newValue);
              }}
              sx={{ width: 80 }}
            />
            <TextField
              size="small"
              label="Rank"
              value={action?.data?.info?.weaponRank || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                const isValid = /^(?:[1-5])?$/.test(newValue);
                if (isValid) handleWeaponRank(newValue);
              }}
              sx={{ width: 80 }}
            />
          </Stack>
        )}
      </Stack>
      {action?.data?.info?.weapon && (
        <Card sx={{ width: 700, p: 2 }}>
          <Grid container spacing={1}>
            <Grid size={4}>
              <Stack alignItems="center">
                <Box
                  component="img"
                  src={weapIcons[`../assets/weap/${gameType}/${action?.data?.info?.weapon}.webp`]?.default}
                  alt=""
                  sx={{ width: 200, height: 200, objectFit: "contain" }}
                />
              </Stack>
            </Grid>
            <Grid size={8}>
              <Stack>
                <Typography variant="subtitle1" fontWeight="bold">
                  {WEAP[action.data.info.weapon].name}
                </Typography>
                <Typography variant="body2">
                  {gameType === "HSR"
                    && `Base HP: ${WEAP[action.data.info.weapon].base.FLAT_HP}`}
                </Typography>
                <Typography variant="body2">
                  {`Base ATK: ${WEAP[action.data.info.weapon].base.FLAT_ATK}`}
                </Typography>
                <Typography variant="body2">
                  {gameType === "HSR"
                    ? `Base DEF: ${WEAP[action.data.info.weapon].base.FLAT_DEF}`
                    : WEAP[action.data.info.weapon].substat}
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                  {WEAP[action.data.info.weapon].subtitle}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {WEAP[action.data.info.weapon].desc}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      )}
    </Stack>
  );
};

export default ModalEditWeapon;
