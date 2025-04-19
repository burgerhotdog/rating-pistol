import { useState } from "react";
import { Stack, Grid, Button } from "@mui/material";
import { WeaponId, WeaponLevel, WeaponRank } from "./forms";
import Display from "./Display";

const Weapon = ({ gameId, modalPipe, saveAvatar, closeModal }) => {
  const { id, data } = modalPipe;
  const [weaponId, setWeaponId] = useState(data.weaponId);
  const [weaponLevel, setWeaponLevel] = useState(data.weaponLevel);
  const [weaponRank, setWeaponRank] = useState(data.weaponRank);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await saveAvatar(id, { weaponId, weaponLevel, weaponRank });
    closeModal();
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Grid container spacing={2} sx={{ width: 700 }}>
        <Grid size="grow">
          <WeaponId
            gameId={gameId}
            id={id}
            weaponId={weaponId}
            setWeaponId={setWeaponId}
            setWeaponLevel={setWeaponLevel}
            setWeaponRank={setWeaponRank}
          />
        </Grid>

        <Grid size="auto">
          <WeaponLevel
            gameId={gameId}
            weaponId={weaponId}
            weaponLevel={weaponLevel}
            setWeaponLevel={setWeaponLevel}
          />
        </Grid>

        <Grid size="auto">
          <WeaponRank
            gameId={gameId}
            weaponId={weaponId}
            weaponRank={weaponRank}
            setWeaponRank={setWeaponRank}
          />
        </Grid>

        <Grid size={12}>
          <Display
            gameId={gameId}
            weaponId={weaponId}
            weaponRank={weaponRank}
          />
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
