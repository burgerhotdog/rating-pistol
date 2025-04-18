import React, { useState } from "react";
import { Stack, Divider, Button } from "@mui/material";
import InputLevels from "./InputLevels";
import InputSkills from "./InputSkills";

const Avatar = ({ gameId, modalPipe, setModalPipe, pushModalPipe }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await pushModalPipe();
    setModalPipe({});
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Stack direction="row" spacing={2}>
        <InputLevels
          gameId={gameId}
          modalPipe={modalPipe}
          setModalPipe={setModalPipe}
        />

        <Divider orientation="vertical" flexItem />

        <InputSkills
          gameId={gameId}
          modalPipe={modalPipe}
          setModalPipe={setModalPipe}
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
