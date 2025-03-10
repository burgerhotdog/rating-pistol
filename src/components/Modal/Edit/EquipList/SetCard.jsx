import React from "react";
import {
  Card,
  Grid2 as Grid,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import getData from "../../../getData"
import getIcons from "../../../getIcons";
import getSetBonuses from "../../../getSetBonuses";
import getWeaponDesc from "./getWeaponDesc";

const SetCard = ({ gameId, action }) => {
  const { generalData, equipData, weaponData } = getData[gameId];
  const { weaponIcons } = getIcons[gameId];
  const setBonuses = useMemo(() => getSetBonuses(action.data.equipList), [action.data.equipList]);

  const weaponId = action.data.weaponId;
  const weapon = weaponData?.[weaponId];

  if (!weaponId || !weapon) {
    return (
      <Card sx={{ width: 700, p: 2 }}>
        <Stack justifyContent="center" alignItems="center" sx={{ minHeight: 150 }}>
          <Typography variant="body1" color="text.disabled">
            No {generalData.SECTIONS[1]} Selected
          </Typography>
        </Stack>
      </Card>
    );
  }

  return (
    <Card sx={{ width: 700, p: 2 }}>
      <Grid container spacing={1}>
        <Grid size={4}>
          <Stack alignItems="center">
            <Box
              component="img"
              src={weaponIcons[`./${weaponId}.webp`]?.default}
              alt=""
              sx={{ width: 200, height: 200, objectFit: "contain" }}
            />
          </Stack>
        </Grid>

        <Grid size={8}>
          <Stack>
            <Typography variant="subtitle1" fontWeight="bold">
              {weapon.name}
            </Typography>

            {Object.entries(weapon.statBase).map(([key, value]) => {
              const { name } = equipData.STAT_INDEX[key] || {};
              return (
                <Typography key={key} variant="body2">
                  Base {name}: {value}
                </Typography>
              );
            })}

            {weapon.statSub &&
              Object.entries(weapon.statSub).map(([key, value]) => {
                const { name, percent } = equipData.STAT_INDEX[key] || {};
                return (
                  <Typography key={key} variant="body2">
                    {name}: {value}
                    {percent ? "%" : ""}
                  </Typography>
                );
              })}

            <Typography variant="subtitle2" fontWeight="bold" mt={1}>
              {weapon.descHead}
            </Typography>

            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              {getWeaponDesc(weapon, action.data.rank)}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};

export default SetCard;
