import React from "react";
import {
  Grid2 as Grid,
  Stack,
  Box,
  Divider,
  Card,
  Autocomplete,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import EditEquipListPiece from "./EditEquipListPiece";
import getData from "../../getData";
import getIcons from "../../getIcons";

const EditEquipList = ({
  gameId,
  action,
  setAction,
}) => {

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        {[0, 1, 2, 3, 4, ...(gameId === "HSR" || gameId === "ZZZ" ? [5] : [])].map((mainIndex) => (
          <EditEquipListPiece
            key={mainIndex}
            gameId={gameId}
            action={action}
            setAction={setAction}
            mainIndex={mainIndex}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default EditEquipList;
