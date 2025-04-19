import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { INFO_DATA } from "@data";

const Level = ({ gameId, level, setLevel }) => {
  const [rawLevel, setRawLevel] = useState(String(level ?? ""));
  const resetRawLevel = () => setRawLevel(String(level ?? ""));
  useEffect(() => resetRawLevel(), [level]);

  const handleLevel = () => {
    const newValue = Number(rawLevel);
    if (isNaN(newValue)) {
      resetRawLevel();
      return;
    };

    const outOfBounds = newValue < 1 || newValue > INFO_DATA[gameId].MAX_LEVEL;
    if (outOfBounds || !Number.isInteger(newValue)) {
      resetRawLevel();
      return;
    };

    setLevel(newValue);
  };

  return (
    <TextField
      value={rawLevel ?? ""}
      label="Level"
      onChange={(e) => setRawLevel(e.target.value)}
      onBlur={handleLevel}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleLevel();
          e.target.blur();
        }
      }}
      slotProps={{ htmlInput: { inputMode: "numeric" } }}
      sx={{ width: 75 }}
    />
  );
};

export default Level;
