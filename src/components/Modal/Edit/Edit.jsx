import { useState } from 'react';
import {
  Paper,
  Divider,
  Stack,
  Box,
  Button,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { EQUIP_ASSETS } from '@assets';
import { INFO_DATA } from '@data';
import { WeaponId, Mainstat, Substat } from './Forms';

const Edit = ({ gameId, modalPipe, saveAvatar, closeModal, deleteAvatar }) => {
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
    <Stack alignItems="center" spacing={2}>
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
        {INFO_DATA[gameId].EQUIP_NAMES.map((name, index) => (
          <Tab
            key={index}
            label={(
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  component="img"
                  src={EQUIP_ASSETS[gameId][index]}
                  sx={{ width: 24, height: 24, objectFit: 'contain' }}
                />
                <Typography variant="body2">
                  {name}
                </Typography>
              </Stack>
            )}
          />
        ))}
      </Tabs>
      
      <Stack direction="row" spacing={1}>
        <Button
          onClick={() => setTabIndex(tabIndex - 1)}
          color="inherit"
          sx={{ visibility: tabIndex === 0 ? 'hidden' : 'visible' }}
        >
          <ChevronLeft />
        </Button>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={1}>
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
        <Button
          onClick={() => setTabIndex(tabIndex + 1)}
          color="inherit"
          sx={{ visibility: tabIndex === INFO_DATA[gameId].EQUIP_NAMES.length - 1 ? 'hidden' : 'visible' }}
        >
          <ChevronRight />
        </Button>
      </Stack>

      <Stack
        direction="row"
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

        <Stack direction="row" spacing={2} justifyContent="center">
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
        </Stack>

        {/* Empty space on the right to balance layout */}
        <Box width={75} />
      </Stack>
    </Stack>
  );
};

export default Edit;
