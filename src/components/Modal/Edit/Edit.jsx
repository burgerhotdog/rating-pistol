import { useState } from "react";
import {
  Paper,
  Divider,
  Grid,
  Stack,
  Box,
  Button,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { EQUIP_ASSETS } from "@assets";
import { INFO_DATA } from "@data";
import { WeaponId, SetId, Mainstat, Substat } from "./Forms";
import PreviewSet from "./PreviewSet";

const Edit = ({ gameId, modalPipe, saveAvatar, closeModal, deleteAvatar }) => {
  const { id, data } = modalPipe;
  const [weaponId, setWeaponId] = useState(data.weaponId);
  const [equipList, setEquipList] = useState(() => structuredClone(data.equipList));
  const [viewIndex, setViewIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await saveAvatar(id, { ...data, weaponId, equipList });
    closeModal();
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteAvatar(id);
    closeModal();
  }

  return (
    <Stack alignItems="center" spacing={2}>
      <Grid container spacing={2} minWidth={950}>
        <Grid size={12}>
          <WeaponId
            gameId={gameId}
            id={id}
            weaponId={weaponId}
            setWeaponId={setWeaponId}
          />
        </Grid>
        <Grid size={12}>
          <Tabs
            value={viewIndex}
            onChange={(_, newValue) => setViewIndex(newValue)}
          >
            {INFO_DATA[gameId].EQUIP_NAMES.map((name, index) => (
              <Tab
                key={index}
                label={(
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      component="img"
                      src={EQUIP_ASSETS[gameId][index]}
                      sx={{ width: 24, height: 24, objectFit: "contain" }}
                    />
                    <Typography variant="body2">
                      {name}
                    </Typography>
                  </Stack>
                )}
              />
            ))}
          </Tabs>
          <Paper sx={{ width: 700, p: 2 }}>
            <Stack direction="row" justifyContent="center" spacing={2}>
              <SetId
                gameId={gameId}
                equipList={equipList}
                setEquipList={setEquipList}
                mainIndex={viewIndex}
              />
              <Stack spacing={1}>
                <Mainstat
                  gameId={gameId}
                  equipList={equipList}
                  setEquipList={setEquipList}
                  mainIndex={viewIndex}
                />

                <Divider />

                {equipList[viewIndex].statList.map((_, subIndex) => (
                  <Substat
                    key={subIndex}
                    gameId={gameId}
                    equipList={equipList}
                    setEquipList={setEquipList}
                    mainIndex={viewIndex}
                    subIndex={subIndex}
                  />
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size="grow">
        </Grid>

        <Grid size={12}>
          <PreviewSet gameId={gameId} equipList={equipList} />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2}>
        <Button
          onClick={handleSave}
          loading={isLoading}
          variant="contained"
        >
          Save
        </Button>
        <Button
          onClick={handleDelete}
          loading={isLoading}
          variant="outlined"
          color="secondary"
        >
          Delete
        </Button>
      </Stack>
    </Stack>
  );
};

export default Edit;
