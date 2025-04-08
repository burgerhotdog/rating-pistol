import React, { useState } from "react";
import {
  Stack,
  Divider,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import SkillMap from "./SkillMap";
import BASIC_DATA from "@data/misc/basic";

const AvatarModal = ({ gameId, pipe, setPipe, savePipe }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // level
  const handleLevel = (e) => {
    const newValue = Number(e.target.value);
    if (isNaN(newValue)) return;

    const outOfBounds =
      newValue < 0 ||
      newValue > BASIC_DATA[gameId].MAX_LEVEL ||
      !Number.isInteger(newValue);
    if (outOfBounds) return;

    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        level: newValue,
      },
    }));
  };

  // rank
  const rankOptions = () => {
    const giNoRank = gameId === "gi" && (
      pipe.id === "10000062" // Aloy
    );
    const noRank = giNoRank;

    return noRank ? [0] : Array.from({ length: 7 }, (_, i) => i);
  };

  const handleRank = (e) => {
    const newValue = Number(e.target.value);
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        rank: newValue,
      },
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    await savePipe();
    setPipe({});
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Stack direction="row" spacing={2}>
        <Stack direction="row" spacing={2}>
          <TextField
            value={pipe.data.level ?? ""}
            label="Level"
            onChange={handleLevel}
            slotProps={{ htmlInput: { inputMode: "numeric" } }}
            sx={{ width: 75 }}
          />

          <FormControl sx={{ width: 75 }}>
            <InputLabel id="rank-select" shrink>
              Rank
            </InputLabel>
            <Select
              labelId="rank-select"
              label="Rank"
              value={pipe.data.rank ?? 0}
              onChange={handleRank}
              notched
            >
              {rankOptions().map((rank) => (
                <MenuItem key={rank} value={rank}>
                  {`${BASIC_DATA[gameId].AVATAR_PREFIX}${rank}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Divider orientation="vertical" flexItem />

        <SkillMap
          gameId={gameId}
          pipe={pipe}
          setPipe={setPipe}
        />
      </Stack>

      <Button
        onClick={handleSave}
        loading={isLoading}
        variant="contained"
      >
        Save
      </Button>
    </Stack>
  );
};

export default AvatarModal;
