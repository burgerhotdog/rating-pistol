import { Paper, Box, Typography, Divider, Stack } from "@mui/material";
import { AVATAR_DATA, LABEL_DATA } from "@data";

const Info = ({ gameId, avatarId, isFullBuild, ratingData }) => {
  const { percentile, score, q3 } = ratingData;

  return (
    <Paper sx={{ padding: 3, width: 350 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: "primary.main" }} gutterBottom>
          Roll Value: {score.toFixed()}%
        </Typography>
        <Typography variant="body1" gutterBottom>
          Percentile: {percentile.toFixed(2)}
        </Typography>
        {!isFullBuild && (
          <Typography variant="body1" sx={{ color: "text.disabled" }} gutterBottom>
            Q3: {q3.toFixed()}%
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ color: "primary.main" }} gutterBottom>
          Analysis
        </Typography>
      </Box>
    </Paper>
  );
};

export default Info;
