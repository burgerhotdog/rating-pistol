import React from "react";
import {
  Grid2 as Grid,
  Box,
  Stack,
  Card,
  Autocomplete,
  TextField,
  Typography,
} from "@mui/material";
import getData from "../../getData";
import getIcons from "../../getIcons";

const EditWeapon = ({
  gameType,
  action,
  setAction,
}) => {
  const { INFO, CHARACTERS, WEAPONS } = getData(gameType);
  const { weaponIcons } = getIcons(gameType);
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };

  const weapOptions = () => {
    return Object.keys(WEAPONS)
      .filter(id => WEAPONS[id].type === CHARACTERS[action.id]?.type)
      .sort((a, b) => {
        const rarityA = WEAPONS[a].rarity;
        const rarityB = WEAPONS[b].rarity;
        return rarityA !== rarityB ? 
          rarityB - rarityA : 
          WEAPONS[a].name.localeCompare(WEAPONS[b].name);
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
          weaponLevel: newValue ? INFO.LEVEL_CAP.toString() : "",
          weaponRank: newValue ? "1" : "",
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
          getOptionLabel={(id) => WEAPONS[id]?.name || ""}
          onChange={(_, newValue) => handleWeapon(newValue)}
          renderOption={(props, id) => {
            const { key, ...idProps } = props;
            const rarity = WEAPONS[id]?.rarity;
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
                  src={weaponIcons[`./${id}.webp`]?.default}
                  alt={""}
                  sx={{ width: 24, height: 24, objectFit: "contain" }}
                />
                {WEAPONS[id]?.name || ""}
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={INFO.SECTION_NAMES[1]}
            />
          )}
          fullWidth
          sx={{ minWidth: 350 }}
          disableClearable={action?.data?.info?.weapon === ""}
        />
        <Autocomplete
          size="small"
          value={action?.data?.info?.weaponLevel || ""}
          options={Array.from({ length: INFO.LEVEL_CAP / 10 }, (_, i) => (INFO.LEVEL_CAP - i * 10).toString())}
          onChange={(_, newValue) => {
            if (newValue) handleWeaponLevel(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Level"
            />
          )}
          sx={{ width: 80 }}
          disabled={!action?.data?.info?.weapon}
          disableClearable
        />
        <Autocomplete
          size="small"
          value={action?.data?.info?.weaponRank || ""}
          options={["1", "2", "3", "4", "5"]}
          onChange={(_, newValue) => {
            if (newValue) handleWeaponRank(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Rank"
            />
          )}
          sx={{ width: 80 }}
          disabled={!action?.data?.info?.weapon}
          disableClearable
        />
      </Stack>
      <Card
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 700,
          minHeight: 200,
          p: 2
        }}
      >
        {action?.data?.info?.weapon ? (
          <Grid container spacing={1}>
            <Grid size={4}>
              <Stack alignItems="center">
                <Box
                  component="img"
                  src={weaponIcons[`./${action?.data?.info?.weapon}.webp`]?.default}
                  alt=""
                  sx={{ width: 200, height: 200, objectFit: "contain" }}
                />
              </Stack>
            </Grid>
            <Grid size={8}>
              <Stack>
                <Typography variant="subtitle1" fontWeight="bold">
                  {WEAPONS[action.data.info.weapon].name}
                </Typography>
                <Typography variant="body2">
                  {gameType === "HSR"
                    && `Base HP: ${WEAPONS[action.data.info.weapon].base.FLAT_HP}`}
                </Typography>
                <Typography variant="body2">
                  {`Base ATK: ${WEAPONS[action.data.info.weapon].base.FLAT_ATK}`}
                </Typography>
                <Typography variant="body2">
                  {gameType === "HSR"
                    ? `Base DEF: ${WEAPONS[action.data.info.weapon].base.FLAT_DEF}`
                    : WEAPONS[action.data.info.weapon].substat}
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                  {WEAPONS[action.data.info.weapon].subtitle}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {WEAPONS[action.data.info.weapon].desc}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1" color="text.disabled">
            No {INFO.SECTION_NAMES[1]} Selected
          </Typography>
        )}
      </Card>
    </Stack>
  );
};

export default EditWeapon;
