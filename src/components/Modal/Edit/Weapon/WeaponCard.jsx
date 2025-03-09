import React from "react";
import {
  Grid2 as Grid,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import getData from "../../../getData"
import getIcons from "../../../getIcons";
import getWeaponDesc from "./getWeaponDesc";

const WeaponCard = ({ gameId, weapon, id, rank }) => {
  const { weaponIcons } = getIcons(gameId);

  return (
    <Grid container spacing={1}>
      <Grid size={4}>
        <Stack alignItems="center">
          <Box
            component="img"
            src={weaponIcons[`./${id}.webp`]?.default}
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
            const STAT_INDEX = getData(gameId).equipData.STAT_INDEX;
            const { name } = STAT_INDEX[key] || {};

            return (
              <Typography key={key} variant="body2">
                Base {name}: {value}
              </Typography>
            );
          })}

          {weapon.statSub && (() => {
            const STAT_INDEX = getData(gameId).equipData.STAT_INDEX;
            const key = Object.keys(weapon.statSub)[0];
            const value = Object.values(weapon.statSub)[0];
            const { name, percent } = STAT_INDEX[key] || {};

            return (
              <Typography variant="body2">
                {name}: {value}{percent ? "%" : ""}
              </Typography>
            );
          })()}

          <Typography variant="subtitle2" fontWeight="bold" mt={1}>
            {weapon.descHead}
          </Typography>

          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {getWeaponDesc(weapon, rank)}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default WeaponCard;
