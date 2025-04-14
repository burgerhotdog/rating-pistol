import React from "react";
import { Stack, Box, Paper, Divider } from "@mui/material";
import { INFO } from "@data/static";
import SetId from "./SetId";
import Mainstat from "./Mainstat";
import Substat from "./Substat";

const Input = ({ gameId, pipe, setPipe, mainIndex }) => {
  return (
    <Paper sx={{ width: 300, p: 2 }}>
      <Box sx={{ height: 300 }}>
        <Stack spacing={1}>
          <SetId
            gameId={gameId}
            pipe={pipe}
            setPipe={setPipe}
            mainIndex={mainIndex}
          />

          <Mainstat
            gameId={gameId}
            pipe={pipe}
            setPipe={setPipe}
            mainIndex={mainIndex}
          />

          <Divider />

          {pipe.data.equipList[mainIndex].statList.map((_, subIndex) => (
            <Substat
              key={subIndex}
              gameId={gameId}
              pipe={pipe}
              setPipe={setPipe}
              mainIndex={mainIndex}
              subIndex={subIndex}
            />
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};

export default Input;
