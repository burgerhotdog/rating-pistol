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
import { DATA } from "../../importData"

const AvatarModal = ({
  gameId,
  pipe,
  setPipe,
  savePipe,
}) => {
  const { LEVEL_CAP, PREFIX } = DATA[gameId];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // level
  const handleLevel = (event) => {
    const newValue = event.target.value;
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
    const giNoRankOpt = gameId === "gi" && (
      pipe.id === "10000062" // Aloy
    );
    
    const noRankOpt = giNoRankOpt;

    return noRankOpt ? ["0"] : ["0", "1", "2", "3", "4", "5", "6"];
  };

  const rankOptionLabel = (rank) => {
    return `${PREFIX}${rank}`;
  }

  const handleRank = (event) => {
    const newValue = event.target.value;
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        rank: newValue,
      },
    }));
  };

  // validate & save
  const validate = () => {
    // level
    if (!/^[1-9]\d*$/.test(pipe.data.level)) {
      setError("level");
      return false;
    }
    const level = Number(pipe.data.level);
    if (level < 1 || level > LEVEL_CAP) {
      setError("level");
      return false;
    }

    // rank
    if (!pipe.data.rank) {
      setError("rank");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return
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
            error={error === "level"}
          />

          <FormControl sx={{ width: 75 }}>
            <InputLabel id="rank-select" shrink>
              Rank
            </InputLabel>
            <Select
              labelId="rank-select"
              label="Rank"
              value={pipe.data.rank ?? ""}
              onChange={handleRank}
              notched
            >
              {rankOptions().map((rank) => (
                <MenuItem key={rank} value={rank}>
                  {rankOptionLabel(rank)}
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
