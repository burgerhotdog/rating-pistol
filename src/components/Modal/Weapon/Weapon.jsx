import React, { useState } from "react";
import { Stack, Grid, Button } from "@mui/material";
import { WeaponId, WeaponLevel, WeaponRank } from "./forms";
import Display from "./Display";

const Weapon = ({ gameId, modalPipe, setModalPipe, pushModalPipe }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await pushModalPipe();
    setModalPipe({});
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Grid container spacing={2} sx={{ width: 700 }}>
        <Grid size="grow">
          <WeaponId gameId={gameId} modalPipe={modalPipe} setModalPipe={setModalPipe} />
        </Grid>

        <Grid size="auto">
          <WeaponLevel gameId={gameId} modalPipe={modalPipe} setModalPipe={setModalPipe} />
        </Grid>

        <Grid size="auto">
          <WeaponRank gameId={gameId} modalPipe={modalPipe} setModalPipe={setModalPipe} />
        </Grid>

        <Grid size={12}>
          <Display gameId={gameId} modalPipe={modalPipe} />
        </Grid>
      </Grid>

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

export default Weapon;
