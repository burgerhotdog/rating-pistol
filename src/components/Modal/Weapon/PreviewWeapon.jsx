import React, { useMemo } from "react";
import {
  Card,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import getData from "../../getData"
import getIcons from "../../getIcons";
import getWeaponDesc from "./getWeaponDesc";

const PreviewWeapon = ({ gameId, modalPipe }) => {
  const { generalData, equipData, weaponData } = getData[gameId];
  const { weaponIcons } = getIcons[gameId];

  const weaponId = modalPipe.data.weaponId;
  const weapon = weaponData?.[weaponId];

  const weaponDesc = useMemo(() => getWeaponDesc(weapon, modalPipe.data.rank), [
    weapon,
    modalPipe.data.rank,
  ]);

  if (!weapon) {
    return (
      <Card sx={{ p: 2 }}>
        <Stack justifyContent="center" alignItems="center" sx={{ minHeight: 200 }}>
          <Typography variant="body1" color="text.disabled">
            No {generalData.SECTIONS[1]} Selected
          </Typography>
        </Stack>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={1}>
        <Box
          component="img"
          alt={weaponId}
          src={weaponIcons[`./${weaponId}.webp`]?.default}
          sx={{ width: 200, height: 200, objectFit: "contain" }}
        />
        
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

          {weapon.statSub && (
            Object.entries(weapon.statSub).map(([key, value]) => {
              const { name, percent } = equipData.STAT_INDEX[key] || {};
              return (
                <Typography key={key} variant="body2">
                  {name}: {value}
                  {percent ? "%" : ""}
                </Typography>
              );
            })
          )}

          <Typography variant="subtitle2" fontWeight="bold" mt={1}>
            {weapon.descHead}
          </Typography>

          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {weaponDesc}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default PreviewWeapon;
