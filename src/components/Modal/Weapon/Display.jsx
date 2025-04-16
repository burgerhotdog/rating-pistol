import React, { useMemo } from "react";
import { Paper, Box, Stack, Typography } from "@mui/material";
import { WEAPON_ASSETS } from "@assets";
import { STATS, LABELS, WEAPONS } from "@data";
import getWeaponDescArr from "./getWeaponDescArr";

const Display = ({ gameId, pipe }) => {
  const weaponId = pipe.data.weaponId;
  const weapon = WEAPONS[gameId][weaponId];

  const weaponDescArr = useMemo(
    () => getWeaponDescArr(weapon, pipe.data.weaponRank),
    [weapon, pipe.data.weaponRank],
  );

  if (!weapon) {
    return (
      <Paper sx={{ p: 2, width: 700, height: 200 }}>
        <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
          <Typography variant="h6" color="text.disabled">
            No {LABELS[gameId].weapon} Selected
          </Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, width: 700, minHeight: 200 }}>
      <Stack direction="row" spacing={1} sx={{ height: "100%" }}>
        <Box
          component="img"
          alt={weaponId}
          src={WEAPON_ASSETS[`./${gameId}/${weaponId}.webp`]?.default}
          sx={{ width: 200, height: 200, objectFit: "contain" }}
        />
        
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {weapon.name}
          </Typography>

          {Object.entries(weapon.statBase).map(([key, value]) => {
            const { name } = STATS[gameId][key] || {};
            const base = gameId === "hsr" ? "" : "Base ";
            return (
              <Typography key={key} variant="body2">
                {base}{name}: {value}
              </Typography>
            );
          })}

          {weapon.statSub && (
            Object.entries(weapon.statSub).map(([key, value]) => {
              const { name, percent } = STATS[gameId][key] || {};
              return (
                <Typography key={key} variant="body2">
                  {name}: {value}
                  {percent ? "%" : ""}
                </Typography>
              );
            })
          )}

          <Typography variant="subtitle2" mt={1}>
            <strong>{weapon.descHead}</strong>
          </Typography>

          <Box sx={{ whiteSpace: "pre-line" }}>
            {weaponDescArr.map(([isVar, text], index) => (
              <Typography
                key={index}
                variant="body2"
                fontWeight={Boolean(isVar) ? "bold" : "normal"}
                sx={{
                  display: "inline",
                  color: Boolean(isVar) ? "primary.main" : "text.primary",
                 }}
              >
                {text}
              </Typography>
            ))}
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
};

export default Display;
