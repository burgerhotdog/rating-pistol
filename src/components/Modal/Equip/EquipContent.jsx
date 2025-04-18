import React, { useState } from "react";
import {
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
import Input from "./Input";
import PreviewSet from "./PreviewSet";
import Analysis from "./Analysis";

const EquipContent = ({ gameId, modalPipe, setModalPipe, pushModalPipe }) => {
  const [viewIndex, setViewIndex] = useState(0);
  const equipSlots = [...Array(INFO_DATA[gameId].MAIN_LEN).keys()];
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await pushModalPipe(true);
    setModalPipe({});
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
                        <ListItemText primary={INFO_DATA[gameId].EQUIP_NAMES[index]} />
                      </Stack>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Card>

            <Input
              gameId={gameId}
              modalPipe={modalPipe}
              setModalPipe={setModalPipe}
              mainIndex={viewIndex}
            />
          </Stack>
        </Grid>
        <Grid size="grow">
          <Analysis
            gameId={gameId}
            avatarId={modalPipe.id}
            equipIndex={viewIndex}
            equipObj={modalPipe.data.equipList[viewIndex]}
          />
        </Grid>
        
        <Grid size={12}>
          <PreviewSet
            gameId={gameId}
            modalPipe={modalPipe}
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

export default EquipContent;
