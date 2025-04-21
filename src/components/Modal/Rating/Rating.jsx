import { Box, Typography } from "@mui/material";
import Histogram from "./Histogram";

const Rating = ({ gameId, modalPipe }) => {
  const { id, data, rating } = modalPipe;

  return (
    <Box sx={{ width: 500 }}>
      <Histogram
        gameId={gameId}
        avatarId={id}
        percentile={rating.avatar.percentile}
        score={rating.avatar.score}
        simScores={rating.avatar.simScores}
      />
    </Box>
  );
};

export default Rating;
