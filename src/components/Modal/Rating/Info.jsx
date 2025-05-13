import { Paper, Box, Typography, Divider, Stack, Tooltip, IconButton } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import { AVATAR_DATA, LABEL_DATA } from "@data";

const Info = ({ gameId, avatarId, isFullBuild, ratingData }) => {
  const { percentile, score, mean, sd, bounds, q3 } = ratingData;

  return (
    <Paper sx={{ padding: 3, width: 300 }}>
      <Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" sx={{ color: "primary.main" }}>
            Simulation Results:
          </Typography>
          <HelpOutline fontSize="small" color="primary" />
        </Stack>
        <Typography variant="body2">
          Roll Value: {score.toFixed()}%
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} >
          Percentile: {percentile.toFixed(2)}
        </Typography>
        {isFullBuild ? (
          <>
            <Typography variant="body2" gutterBottom sx={{ color: "text.secondary" }}>
              Mean: {mean.toFixed()}% / SD: {sd.toFixed()}%
            </Typography>
            <Typography variant="body2">
              Thresholds:
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Excellent: {bounds[0].toFixed()}%
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Great: {bounds[1].toFixed()}%
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Good: {bounds[2].toFixed()}%
            </Typography>
          </>
        ) : (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Q3 Cutoff: {q3.toFixed()}%
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          Summary
        </Typography>
      </Box>
    </Paper>
  );
};

export default Info;
