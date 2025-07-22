import { Paper, Box, Typography, Divider, Stack } from "@mui/material";
import { AVATAR_ASSETS, RATING_ASSETS } from "@assets";
import { AVATAR_DATA } from "@data";

const RATING_RANK = ["Excellent", "Great", "Good", "Poor"];
const recommendation = [
  "Further investment is unlikely to yield noticeable improvements.",
  "While minor upgrades are possible, your resources may be better allocated elsewhere.",
  "Additional investment may lead to improved performance and consistency.",
  "Significant investment is recommended to improve this character's effectiveness.",
];

const Info = ({ gameId, avatarId, isFullBuild, ratingData }) => {
  const { percentile, score, mean, sd, bounds, q3 } = ratingData;
  const ratingRank = !isFullBuild ? null :
    score >= bounds[0] ? 0 :
    score >= bounds[1] ? 1 :
    score >= bounds[2] ? 2 : 3;

  const Rating = () => {
    const Icon = () => {
      return (
        <Box
          component="img"
          alt={avatarId}
          src={AVATAR_ASSETS[gameId][avatarId]}
          sx={{
            width: 16,
            height: 16,
            verticalAlign: "text-bottom",
          }}
        />
      );
    };

    return (
      <>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" color="primary">
            Rating:
          </Typography>
          <Box
            component="img"
            alt={RATING_RANK[ratingRank]}
            src={RATING_ASSETS[ratingRank]}
            sx={{ width: 24, height: 24 }}
          />
          <Typography variant="h6">
            {RATING_RANK[ratingRank]}
          </Typography>
        </Stack>
        <Typography variant="body2">
          <Icon /> {AVATAR_DATA[gameId][avatarId].name} has a roll value of {score.toFixed()}%, which is {ratingRank === 2 ? "slightly " : ratingRank === 0 ? "significantly " : ""}{score > mean ? "above" : "below"} average. {recommendation[ratingRank]}
        </Typography>
      </>
    );
  };

  const Results = () => {
    return (
      <>
        <Typography variant="h6" color="primary">
          Simulation Results:
        </Typography>
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
              Excellent (+2 SD): {bounds[0].toFixed()}%
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Great (+1 SD): {bounds[1].toFixed()}%
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Good (±1 SD): {bounds[2].toFixed()}%
            </Typography>
          </>
        ) : (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Q3: {q3.toFixed()}%
          </Typography>
        )}
      </>
    );
  };

  return (
    <Paper sx={{ p: 3, width: 300 }}>
      {isFullBuild && (
        <>
          <Rating />
          <Divider sx={{ my: 2 }} />
        </>
      )}
      <Results />
    </Paper>
  );
};

export default Info;
