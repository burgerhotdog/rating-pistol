import { Stack, Box, Paper, Divider } from "@mui/material";
import SetId from "./SetId";
import Mainstat from "./Mainstat";
import Substat from "./Substat";

const Input = ({ gameId, equipList, setEquipList, mainIndex }) => {
  return (
    <Paper sx={{ width: 300, p: 2 }}>
      <Box sx={{ height: 300 }}>
        <Stack spacing={1}>
          <SetId
            gameId={gameId}
            equipList={equipList}
            setEquipList={setEquipList}
            mainIndex={mainIndex}
          />

          <Mainstat
            gameId={gameId}
            equipList={equipList}
            setEquipList={setEquipList}
            mainIndex={mainIndex}
          />

          <Divider />

          {equipList[mainIndex].statList.map((_, subIndex) => (
            <Substat
              key={subIndex}
              gameId={gameId}
              equipList={equipList}
              setEquipList={setEquipList}
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
