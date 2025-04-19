import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { INFO_DATA } from "@data";

const WeaponLevel = ({ gameId, weaponId, weaponLevel, setWeaponLevel }) => {
  const [rawLevel, setRawLevel] = useState(String(weaponLevel ?? ""));
  const resetRawLevel = () => setRawLevel(String(weaponLevel ?? ""));
  useEffect(() => resetRawLevel(), [weaponLevel]);

  const handleWeaponLevel = () => {
    const newValue = Number(rawLevel);
    if (isNaN(newValue)) {
      resetRawLevel();
      return;
    }

    const outOfBounds = newValue < 1 || newValue > INFO_DATA[gameId].MAX_LEVEL;
    if (outOfBounds || !Number.isInteger(newValue)) {
      resetRawLevel();
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
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleWeaponLevel();
          e.target.blur();
        }
      }}
      slotProps={{ htmlInput: { inputMode: "numeric" } }}
      sx={{ width: 75 }}
      disabled={!weaponId}
    />
  );
};

export default WeaponLevel;
