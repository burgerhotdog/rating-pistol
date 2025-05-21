import { useState } from "react";
import {
  Paper,
  Divider,
  Grid,
  Stack,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Card,
  Button,
} from "@mui/material";
import { EQUIP_ASSETS } from "@assets";
import { INFO_DATA } from "@data";
import { SetId, Mainstat, Substat } from "./Forms";
import PreviewSet from "./PreviewSet";

const Equip = ({ gameId, modalPipe, saveAvatar, closeModal }) => {
  const { id, data } = modalPipe;
  const [equipList, setEquipList] = useState(() => structuredClone(data.equipList));
  const [viewIndex, setViewIndex] = useState(0);
  const equipSlots = [...Array(INFO_DATA[gameId].MAIN_LEN).keys()];
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await saveAvatar(id, { ...data, equipList });
    closeModal();
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Grid container spacing={2} minWidth={950}>
        <Grid size="auto">
          <Stack direction="row" spacing={2}>
            <Card sx={{ width: 125 }}>
              <List>
                {equipSlots.map((index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      onClick={() => setViewIndex(index)}
                      selected={viewIndex === index}
                    >
                      <Stack direction="row" spacing={1}>
                        <Box
                          component="img"
                          src={EQUIP_ASSETS[gameId][index]}
                          sx={{ width: 24, height: 24, objectFit: "contain" }}
                        />
                        <ListItemText
                          primary={INFO_DATA[gameId].EQUIP_NAMES[index]}
                        />
                      </Stack>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Card>

            <Paper sx={{ width: 350, p: 2 }}>
              <Stack spacing={1}>
                <SetId
                  gameId={gameId}
                  equipList={equipList}
                  setEquipList={setEquipList}
                  mainIndex={viewIndex}
                />

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
            </Paper>
          </Stack>
        </Grid>

        <Grid size="grow">
        </Grid>

        <Grid size={12}>
          <PreviewSet gameId={gameId} equipList={equipList} />
        </Grid>
      </Grid>

      <Button onClick={handleSave} loading={isLoading} variant="contained">
        Save
      </Button>
    </Stack>
  );
};

export default Equip;
