import React from "react";
import { TextField } from "@mui/material";

const MAX_LEVEL = { gi: 90, hsr: 80, ww: 90, zzz: 60 };

const WeaponLevel = ({ gameId, pipe, setPipe }) => {
  const handleWeaponLevel = (e) => {
    const newValue = Number(e.target.value);
    if (isNaN(newValue)) return;
    if (newValue < 1 || newValue > MAX_LEVEL[gameId]) return;
    if (!Number.isInteger(newValue)) return;

    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponLevel: newValue,
      },
    }));
  };

  return (
    <TextField
      value={pipe.data.weaponLevel ?? ""}
      label="Level"
      onChange={handleWeaponLevel}
      slotProps={{ htmlInput: { inputMode: "numeric" } }}
      sx={{ width: 75 }}
      disabled={!pipe.data.weaponId}
    />
  );
};

export default WeaponLevel;
