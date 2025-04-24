import { Stack, Badge, Avatar, Typography, Tooltip, TableCell } from "@mui/material";
import { RATING_ASSETS } from "@assets";

const getIconSrc = (top) => {
  if (top <= 10) return "0";
  if (top <= 25) return "1";
  if (top <= 50) return "2";
  return "3";
};

const RatingCell = ({ setModalPipe, id, data, rating }) => {
  const openModal = () => setModalPipe({ type: "rating", id, data, rating });
  const roundedRating = rating
    ? Math.max(1, 100 - Math.floor(rating.avatar.percentile))
    : 100;
  const iconSrc = getIconSrc(roundedRating);

  return (
    <TableCell>
      <Tooltip title="See Details">
        <Stack direction="row" display="inline-flex" alignItems="center" gap={1}>
          <Badge onClick={openModal} sx={{ cursor: "pointer" }}>
            <Avatar
              alt={String(roundedRating)}
              src={RATING_ASSETS[iconSrc]}
              sx={{ width: 32, height: 32 }}
            />
          </Badge>
          <Typography
            onClick={openModal}
            sx={{ cursor: "pointer" }}
          >
            {`Top ${roundedRating}%`}
          </Typography>
        </Stack>
      </Tooltip>
    </TableCell>
  );
};

export default RatingCell;
