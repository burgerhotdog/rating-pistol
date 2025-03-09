import React from "react";
import {
  Stack,
  Card,
  Box,
  Autocomplete,
  TextField,
  Typography,
} from "@mui/material";
import getData from "../../../getData";
import getIcons from "../../../getIcons";
import WeaponCard from "./WeaponCard";

const EditWeapon = ({
  gameId,
  action,
  setAction,
}) => {
  const { generalData, avatarData, weaponData } = getData(gameId);
  const { weaponIcons } = getIcons(gameId);

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
          value={action?.data.weaponId}
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
                  color: `rarityColor.${rarity}`,
                }}
                {...idProps}
              >
                <Box
                  component="img"
                  loading="lazy"
                  src={weaponIcons[`./${id}.webp`]?.default}
                  alt={""}
                  sx={{ width: 25, height: 25, objectFit: "contain" }}
                />
                {weaponData[id]?.name || ""}
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={generalData.SECTIONS[1]}
            />
          )}
          fullWidth
          disableClearable
        />
        <Autocomplete
          size="small"
          value={action?.data.weaponLevel}
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
          sx={{ width: 100 }}
          disableClearable
          disabled={!action?.data.weaponId}
        />
        <Autocomplete
          size="small"
          value={action?.data?.weaponRank}
          options={[1, 2, 3, 4, 5]}
          getOptionLabel={(opt) => `${generalData.WEAPON_RANK_PREFIX}${opt}`}
          onChange={(_, newValue) => {
            if (newValue) handleWeaponRank(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={generalData.WEAPON_RANK}
            />
          )}
          sx={{ width: 150 }}
          disableClearable
          disabled={!action?.data.weaponId}
        />
      </Stack>
      <Card sx={{ width: 700, p: 2 }}>
        {action?.data.weaponId ? (
          <WeaponCard
            gameId={gameId}
            weapon={weaponData[action.data.weaponId]}
            id={action.data.weaponId}
            rank={action.data.weaponRank}
          />
        ) : (
          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: 150 }}
          >
            <Typography variant="body1" color="text.disabled">
              No {generalData.SECTIONS[1]} Selected
            </Typography>
          </Stack>
        )}
      </Card>
    </Stack>
  );
};

export default EditWeapon;
