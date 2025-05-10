import { Stack, Badge, Avatar, Typography, Tooltip, TableCell } from "@mui/material";
import { RATING_ASSETS } from "@assets";

const getCategory = (percentile) => {
  if (percentile >= 95) return { src: "0", text: "Excellent" };
  if (percentile >= 75) return { src: "1", text: "Great" };
  if (percentile >= 25) return { src: "2", text: "Good" };
  return { src: "3", text: "Poor" };
};

const RatingCell = ({ setModalPipe, id, data, rating }) => {
  const openModal = () => setModalPipe({ type: "rating", id, data, rating });
  const roundedRating = rating.avatar.percentile;
  const category = getCategory(roundedRating);

  return (
    <TableCell>
      <Tooltip title="See Details">
        <Stack direction="row" display="inline-flex" alignItems="center" gap={1}>
          <Badge onClick={openModal} sx={{ cursor: "pointer" }}>
            <Avatar
              alt={String(roundedRating)}
              src={RATING_ASSETS[category.src]}
              sx={{ width: 32, height: 32 }}
            />
          </Badge>
          <Typography
            onClick={openModal}
            sx={{ cursor: "pointer" }}
          >
            {category.text}
          </Typography>
        </Stack>
      </Tooltip>
    </TableCell>
  );
};

export default RatingCell;
