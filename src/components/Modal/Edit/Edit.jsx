import { useState } from 'react';
import { Stack, Tabs, Tab, Paper, Divider, Box, Button } from '@mui/material';
import { INFO_DATA } from '@data';
import { TabLabel } from '@utils';
import { WeaponId, Mainstat, Substat } from './Forms';

const Edit = ({ gameId, modalPipe, saveAvatar, closeModal, deleteAvatar }) => {
  const { EQUIP_NAMES } = INFO_DATA[gameId];
  const { id, data } = modalPipe;
  const [weaponId, setWeaponId] = useState(data.weaponId);
  const [equipList, setEquipList] = useState(() => structuredClone(data.equipList));
  const [tabIndex, setTabIndex] = useState(0);
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
    <Stack alignItems="center" gap={2}>
      <WeaponId
        gameId={gameId}
        id={id}
        weaponId={weaponId}
        setWeaponId={setWeaponId}
      />

      <Tabs
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
      >
        {EQUIP_NAMES.map((name, index) => (
          <Tab key={index} label={TabLabel(gameId, name, index)} />
        ))}
      </Tabs>
      
      <Box display="flex" gap={1}>
        <Paper sx={{ p: 2 }}>
          <Stack gap={1}>
            <Mainstat
              gameId={gameId}
              equipList={equipList}
              setEquipList={setEquipList}
              mainIndex={tabIndex}
            />
            <Divider />
            {equipList[tabIndex].statList.map((_, subIndex) => (
              <Substat
                key={subIndex}
                gameId={gameId}
                equipList={equipList}
                setEquipList={setEquipList}
                mainIndex={tabIndex}
                subIndex={subIndex}
              />
            ))}
          </Stack>
        </Paper>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Button
          onClick={handleDelete}
          loading={isLoading}
          variant="outlined"
          color="error"
        >
          Delete
        </Button>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            onClick={closeModal}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading={isLoading}
            variant="contained"
          >
            Save
          </Button>
        </Box>

        {/* Empty space on the right to balance layout */}
        <Box width={75} />
      </Box>
    </Stack>
  );
};

export default Edit;
