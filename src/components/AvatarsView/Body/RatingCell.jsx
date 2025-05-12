import { Stack, Badge, Avatar, Typography, Tooltip, TableCell } from "@mui/material";
import { RATING_ASSETS } from "@assets";

const RATING_RANK = ["Excellent", "Great", "Good", "Poor"];

const RatingCell = ({ setModalPipe, id, data, rating }) => {
  const { score, bounds } = rating.avatar;
  const openModal = () => setModalPipe({ type: "rating", id, data, rating });
  const ratingRank =
    score >= bounds[0] ? 0 :
    score >= bounds[1] ? 1 :
    score >= bounds[2] ? 2 : 3;

  return (
    <TableCell>
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
    </TableCell>
  );
};

export default RatingCell;
