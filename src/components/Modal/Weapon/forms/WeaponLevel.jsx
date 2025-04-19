import { useState, useEffect } from "react";
import { TextField } from "@mui/material";

const MAX_LEVEL = { gi: 90, hsr: 80, ww: 90, zzz: 60 };

const WeaponLevel = ({ gameId, weaponId, weaponLevel, setWeaponLevel }) => {
  const [rawLevel, setRawLevel] = useState(String(weaponLevel));
  useEffect(() => setRawLevel(String(weaponLevel)), [weaponLevel]);

  const handleWeaponLevel = () => {
    const newValue = Number(rawLevel);

    if (isNaN(newValue)) {
      setRawLevel(String(weaponLevel));
      return;
    }

    if (newValue < 1 || newValue > MAX_LEVEL[gameId]) {
      setRawLevel(String(weaponLevel));
      return;
    }

    if (!Number.isInteger(newValue)) {
      setRawLevel(String(weaponLevel));
      return;
    }

    setWeaponLevel(newValue);
  };

  return (
    <TextField
      value={rawLevel ?? ""}
      label="Level"
      onChange={(e) => setRawLevel(e.target.value)}
      onBlur={handleWeaponLevel}
      slotProps={{ htmlInput: { inputMode: "numeric" } }}
      sx={{ width: 75 }}
      disabled={!weaponId}
    />
  );
};

export default WeaponLevel;
