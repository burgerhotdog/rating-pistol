import { Paper, Box, Typography, Divider } from "@mui/material";
import { AVATAR_DATA } from "@data"

const Info = ({ item, isPiece, percentile, score }) => {
  const percentileText = percentile.toFixed();
  const scoreText = Math.abs((score - 1) * 100).toFixed();

  return (
    <Paper sx={{ padding: 3, width: 350 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          Distribution Percentile
        </Typography>
        <Typography variant="body1" gutterBottom>
          Your {item} outperforms {percentileText}% of all possible {isPiece ? "pieces" : "builds"}.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          Relative Performance
        </Typography>
        <Typography variant="body1" gutterBottom>
          Your {item} performs {scoreText}% {score > 1 ? "better" : "worse"} than the average {isPiece ? "piece" : "build"}.
        </Typography>
      </Box>
    </Paper>
  );
};

export default Info;
