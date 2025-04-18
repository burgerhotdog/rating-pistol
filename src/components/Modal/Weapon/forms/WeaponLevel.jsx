import React from "react";
import { TextField } from "@mui/material";

const MAX_LEVEL = { gi: 90, hsr: 80, ww: 90, zzz: 60 };

const WeaponLevel = ({ gameId, modalPipe, setModalPipe }) => {
  const handleWeaponLevel = (e) => {
    const newValue = Number(e.target.value);
    if (isNaN(newValue)) return;
    if (newValue < 1 || newValue > MAX_LEVEL[gameId]) return;
    if (!Number.isInteger(newValue)) return;

    setModalPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponLevel: newValue,
      },
    }));
  };

  return (
    <TextField
      value={modalPipe.data.weaponLevel ?? ""}
      label="Level"
      onChange={handleWeaponLevel}
      slotProps={{ htmlInput: { inputMode: "numeric" } }}
      sx={{ width: 75 }}
      disabled={!modalPipe.data.weaponId}
    />
  );
};

export default WeaponLevel;
