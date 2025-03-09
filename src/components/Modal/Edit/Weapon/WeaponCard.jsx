import React from "react";
import {
  Grid2 as Grid,
  Box,
  Stack,
  Typography,
} from "@mui/material";
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
          <Typography variant="body2">
            {gameId === "hsr"
              && `Base HP: ${weapon.base._HP}`}
          </Typography>
          <Typography variant="body2">
            {`Base ATK: ${weapon.base._ATK}`}
          </Typography>
          <Typography variant="body2">
            {gameId === "hsr"
              ? `Base DEF: ${weapon.base._DEF}`
              : weapon.substat}
          </Typography>
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
