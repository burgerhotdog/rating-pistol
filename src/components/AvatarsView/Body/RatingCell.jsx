import { Stack, Badge, Avatar, Typography, Tooltip, TableCell } from "@mui/material";
import { RATING_ASSETS } from "@assets";

const getIconSrc = (rating) => {
  if (rating <= 10) return "0";
  if (rating <= 25) return "1";
  if (rating <= 50) return "2";
  return "3";
};

const RatingCell = ({ setModalPipe, id, data, ratings }) => {
  const openModal = () => setModalPipe({ type: "rating", id, data, ratings });
  const roundedRating = Math.ceil(ratings.avatar.percent);
  const iconSrc = getIconSrc(roundedRating)

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
            {roundedRating <= 50
              ? `Top ${roundedRating}%`
              : `Bottom ${101 - roundedRating}%`}
          </Typography>
        </Stack>
      </Tooltip>
    </TableCell>
  );
};

export default RatingCell;
