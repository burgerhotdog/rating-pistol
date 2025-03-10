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
import getData from "../../../getData";
import getIcons from "../../../getIcons";

const EditEquipList = ({
  gameId,
  action,
  setAction,
}) => {
  const { equipData } = getData[gameId];
  const [viewIndex, setViewIndex] = useState(0);
  const equipSlots = [...Array(equipData.EQUIP_NAMES.length).keys()];

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Card sx={{ width: 150 }}>
          <List>
            {equipSlots.map((index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => setViewIndex(index)}
                  selected={viewIndex === index}
                >
                  <ListItemText primary={equipData.EQUIP_NAMES[index]} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Card>

        <EquipCard
          gameId={gameId}
          action={action}
          setAction={setAction}
          mainIndex={viewIndex}
        />
      </Stack>
    </Stack>
  );
};

export default EditEquipList;
