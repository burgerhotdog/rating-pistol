import { useState } from "react";
import { TextField } from "@mui/material";
import { INFO_DATA } from "@data";

const Level = ({ gameId, level, setLevel }) => {
  const [rawLevel, setRawLevel] = useState(String(level));

  const handleLevel = () => {
    if (isNaN(rawLevel)) {
      setRawLevel(String(level));
      return;
    };

    const newValue = Number(rawLevel);

    const outOfBounds = newValue < 1 || newValue > INFO_DATA[gameId].MAX_LEVEL;
    if (outOfBounds || !Number.isInteger(newValue)) {
      setRawLevel(String(level));
      return;
    };

    setLevel(newValue);
  };

  return (
    <TextField
      value={rawLevel}
      label="Level"
      onChange={(e) => setRawLevel(e.target.value)}
      onBlur={handleLevel}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleLevel();
      }}
      slotProps={{ htmlInput: { inputMode: "numeric" } }}
      sx={{ width: 75 }}
    />
  );
};

export default Level;
