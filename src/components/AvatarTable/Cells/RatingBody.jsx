import { Stack, Badge, Avatar, Typography, Tooltip } from "@mui/material";
import { ErrorOutline, InfoOutlined } from "@mui/icons-material";
import { RATING_ASSETS } from "@assets";
import { LABEL_DATA } from "@data";

const RATING_RANK = ["Excellent", "Great", "Good", "Poor"];

const RatingBody = ({ gameId, setModalPipe, id, data, rating }) => {
  if (rating === undefined) return (
    <Tooltip title="Unable to calculate rating due to missing data">
      <ErrorOutline sx={{ color: "error.main" }} />
    </Tooltip>
  );

  if (rating === null) {
    return (
      <Tooltip title={`This ${LABEL_DATA[gameId].avatar} is not affected by substats and thus cannot be rated`}>
        <InfoOutlined sx={{ color: "text.disabled" }} />
      </Tooltip>
    );
  }

  const { score, bounds } = rating.avatar;
  const openModal = () => setModalPipe({ type: "rating", id, data, rating });
  const ratingRank =
    score >= bounds[0] ? 0 :
    score >= bounds[1] ? 1 :
    score >= bounds[2] ? 2 : 3;

  return (
    <Tooltip title="Show Details">
      <Stack
        display="inline-flex"
        direction="row"
        alignItems="center"
        spacing={1}
      >
        <Badge onClick={openModal} sx={{ cursor: "pointer" }}>
          <Avatar
            alt={RATING_RANK[ratingRank]}
            src={RATING_ASSETS[ratingRank]}
            sx={{ width: 32, height: 32 }}
          />
        </Badge>
        <Typography onClick={openModal} sx={{ cursor: "pointer" }}>
          {RATING_RANK[ratingRank]}
        </Typography>
      </Stack>
    </Tooltip>
  );
};

export default RatingBody;
