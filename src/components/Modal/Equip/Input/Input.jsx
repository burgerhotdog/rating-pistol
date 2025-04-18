import React from "react";
import { Stack, Box, Paper, Divider } from "@mui/material";
import SetId from "./SetId";
import Mainstat from "./Mainstat";
import Substat from "./Substat";

const Input = ({ gameId, modalPipe, setModalPipe, mainIndex }) => {
  return (
    <Paper sx={{ width: 300, p: 2 }}>
      <Box sx={{ height: 300 }}>
        <Stack spacing={1}>
          <SetId
            gameId={gameId}
            modalPipe={modalPipe}
            setModalPipe={setModalPipe}
            mainIndex={mainIndex}
          />

          <Mainstat
            gameId={gameId}
            modalPipe={modalPipe}
            setModalPipe={setModalPipe}
            mainIndex={mainIndex}
          />

          <Divider />

          {modalPipe.data.equipList[mainIndex].statList.map((_, subIndex) => (
            <Substat
              key={subIndex}
              gameId={gameId}
              modalPipe={modalPipe}
              setModalPipe={setModalPipe}
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
