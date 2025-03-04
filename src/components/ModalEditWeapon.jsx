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
        }
      },
    }));
  };

  return (
    <Stack gap={2}>
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
        sx={{ minWidth: 400 }}
        disableClearable={action?.data?.info?.weapon === ""}
      />
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
