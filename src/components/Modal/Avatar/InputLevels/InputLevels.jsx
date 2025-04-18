import { Stack } from "@mui/material";
import Level from "./Level";
import Rank from "./Rank";

const InputLevels = ({ gameId, modalPipe, setModalPipe }) => {

  return (
    <Stack direction="row" spacing={2}>
      <Level
        gameId={gameId}
        modalPipe={modalPipe}
        setModalPipe={setModalPipe}
      />
      
      <Rank
        gameId={gameId}
        modalPipe={modalPipe}
        setModalPipe={setModalPipe}
      />
    </Stack>
  );
};

export default InputLevels;
