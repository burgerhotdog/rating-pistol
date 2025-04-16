import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { INFO } from "@data";

const Level = ({ gameId, pipe, setPipe }) => {
  const [inputValue, setInputValue] = useState(String(pipe.data.level));
  
  useEffect(() => {
    setInputValue(String(pipe.data.level));
  }, [pipe.data.level]);

  const handleBlur = () => {
    if (isNaN(inputValue)) {
      setInputValue(String(pipe.data.level));
      return;
    };

    const outOfBounds =
      Number(inputValue) < 1 ||
      Number(inputValue) > INFO[gameId].MAX_LEVEL ||
      !Number.isInteger(Number(inputValue));
    if (outOfBounds) {
      setInputValue(String(pipe.data.level));
      return;
    };

    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        level: Number(inputValue),
      },
    }));
  };

  return (
    <TextField
      value={inputValue}
      label="Level"
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleBlur();
      }}
      slotProps={{ htmlInput: { inputMode: "numeric" } }}
      sx={{ width: 75 }}
    />
  );
};

export default Level;
