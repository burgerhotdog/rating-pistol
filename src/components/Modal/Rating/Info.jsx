import { Paper, Box, Typography, Divider } from "@mui/material";
import { AVATAR_DATA, LABEL_DATA } from "@data";

const Info = ({ gameId, avatarId, activeTab, percentile, score }) => {
  const isFullBuild = activeTab === 0;
  const item = isFullBuild 
    ? AVATAR_DATA[gameId][avatarId].name
    : `This ${LABEL_DATA[gameId].equip}`;
  const percentileText = <strong>{percentile.toFixed()}%</strong>;
  const scoreText = <strong>{Math.abs((score - 1) * 100).toFixed()}%</strong>;

  return (
    <Paper sx={{ padding: 3, width: 350 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          Results
        </Typography>
        <Typography variant="body1" gutterBottom>
          {item} outperformed {percentileText} of our simulated {isFullBuild ? "build" : LABEL_DATA[gameId].equip}s, and performed {scoreText} {score > 1 ? "better" : "worse"} than the average {isFullBuild ? "build" : LABEL_DATA[gameId].equip}.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ color: 'primary.main' }} gutterBottom>
          Analysis
        </Typography>
        <Typography variant="body1" gutterBottom>
          WIP
        </Typography>
      </Box>
    </Paper>
  );
};

export default Info;
