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
import getData from "../../../getData";
import getIcons from "../../../getIcons";

const EditWeapon = ({
  gameId,
  action,
  setAction,
}) => {
  const { generalData, avatarData, weaponData } = getData(gameId);
  const { weaponIcons } = getIcons(gameId);
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };

  const weapOptions = () => {
    return Object.keys(weaponData)
      .filter(id => weaponData[id].type === avatarData[action.id]?.type)
      .sort((a, b) => {
        const rarityA = weaponData[a].rarity;
        const rarityB = weaponData[b].rarity;
        return rarityA !== rarityB
          ? rarityB - rarityA
          : weaponData[a].name.localeCompare(weaponData[b].name);
      });
  };

  const handleWeaponId = (newValue) => {
    setAction((prev) => ({
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
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponLevel: newValue,
      },
    }));
  };

  const handleWeaponRank = (newValue) => {
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponRank: newValue,
      },
    }));
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Autocomplete
          size="small"
          value={action?.data?.weaponId}
          options={weapOptions()}
          getOptionLabel={(id) => weaponData[id]?.name || ""}
          onChange={(_, newValue) => handleWeaponId(newValue)}
          renderOption={(props, id) => {
            const { key, ...idProps } = props;
            const rarity = weaponData[id]?.rarity;
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
                {weaponData[id]?.name || ""}
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={generalData.SECTION_NAMES[1]}
            />
          )}
          fullWidth
          sx={{ minWidth: 350 }}
        />
        <Autocomplete
          size="small"
          value={action?.data?.weaponLevel}
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
          sx={{ width: 80 }}
          disabled={!action?.data?.weaponId}
          disableClearable
        />
        <Autocomplete
          size="small"
          value={action?.data?.weaponRank}
          options={["1", "2", "3", "4", "5"]}
          getOptionLabel={(id) => id.toString() || ""}
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
          disabled={!action?.data?.weaponId}
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
        {action?.data?.weaponId ? (
          <Grid container spacing={1}>
            <Grid size={4}>
              <Stack alignItems="center">
                <Box
                  component="img"
                  src={weaponIcons[`./${action?.data?.weaponId}.webp`]?.default}
                  alt=""
                  sx={{ width: 200, height: 200, objectFit: "contain" }}
                />
              </Stack>
            </Grid>
            <Grid size={8}>
              <Stack>
                <Typography variant="subtitle1" fontWeight="bold">
                  {weaponData[action.data.weaponId].name}
                </Typography>
                <Typography variant="body2">
                  {gameId === "HSR"
                    && `Base HP: ${weaponData[action.data.weaponId].base.FLAT_HP}`}
                </Typography>
                <Typography variant="body2">
                  {`Base ATK: ${weaponData[action.data.weaponId].base.FLAT_ATK}`}
                </Typography>
                <Typography variant="body2">
                  {gameId === "HSR"
                    ? `Base DEF: ${weaponData[action.data.weaponId].base.FLAT_DEF}`
                    : weaponData[action.data.weaponId].substat}
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                  {weaponData[action.data.weaponId].subtitle}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {weaponData[action.data.weaponId].desc}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1" color="text.disabled">
            No {generalData.SECTION_NAMES[1]} Selected
          </Typography>
        )}
      </Card>
    </Stack>
  );
};

export default EditWeapon;
