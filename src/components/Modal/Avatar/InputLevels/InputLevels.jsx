import { Stack } from "@mui/material";
import Level from "./Level";
import Rank from "./Rank";

const InputLevels = ({ gameId, pipe, setPipe }) => {

  return (
    <Stack direction="row" spacing={2}>
      <Level
        gameId={gameId}
        pipe={pipe}
        setPipe={setPipe}
      />
      
      <Rank
        gameId={gameId}
        pipe={pipe}
        setPipe={setPipe}
      />
    </Stack>
  );
};

export default InputLevels;
