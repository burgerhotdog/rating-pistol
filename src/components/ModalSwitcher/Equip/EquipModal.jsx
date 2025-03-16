import React, { useState } from "react";
import {
  Grid2 as Grid,
  Stack,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Card,
  Autocomplete,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import EquipCard from "./EquipCard";
import PreviewSet from "./PreviewSet";
import getData from "../../getData";

const EquipModal = ({
  gameId,
  modalPipe,
  setModalPipe,
  savePipe,
}) => {
  const { EQUIP_NAMES } = getData[gameId];
  const [viewIndex, setViewIndex] = useState(0);
  const equipSlots = [...Array(EQUIP_NAMES.length).keys()];
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await savePipe();

    setModalPipe({});
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Grid container spacing={2} minWidth={900}>
        <Grid size="auto">
          <Stack direction="row" spacing={2}>
            <Card sx={{ width: 100 }}>
              <List>
                {equipSlots.map((index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      onClick={() => setViewIndex(index)}
                      selected={viewIndex === index}
                    >
                      <ListItemText primary={EQUIP_NAMES[index]} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Card>

            <EquipCard
              gameId={gameId}
              modalPipe={modalPipe}
              setModalPipe={setModalPipe}
              mainIndex={viewIndex}
            />
          </Stack>
        </Grid>
        <Grid size="grow">
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

export default EquipModal;
