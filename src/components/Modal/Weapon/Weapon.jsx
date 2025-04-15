import React, { useState } from "react";
import { Stack, Grid, Button } from "@mui/material";
import { WeaponId, WeaponLevel, WeaponRank } from "./forms";
import Display from "./Display";

const Weapon = ({ gameId, pipe, setPipe, savePipe }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await savePipe();
    setPipe({});
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Grid container spacing={2} sx={{ width: 700 }}>
        <Grid size="grow">
          <WeaponId gameId={gameId} pipe={pipe} setPipe={setPipe} />
        </Grid>

        <Grid size="auto">
          <WeaponLevel gameId={gameId} pipe={pipe} setPipe={setPipe} />
        </Grid>

        <Grid size="auto">
          <WeaponRank gameId={gameId} pipe={pipe} setPipe={setPipe} />
        </Grid>

        <Grid size={12}>
          <Display gameId={gameId} pipe={pipe} />
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
