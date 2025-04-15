import React, { useState } from "react";
import { Stack, Divider, Button } from "@mui/material";
import InputLevels from "./InputLevels";
import InputSkills from "./InputSkills";

const Avatar = ({ gameId, pipe, setPipe, savePipe }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await savePipe();
    setPipe({});
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Stack direction="row" spacing={2}>
        <InputLevels
          gameId={gameId}
          pipe={pipe}
          setPipe={setPipe}
        />

        <Divider orientation="vertical" flexItem />

        <InputSkills
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

export default Avatar;
