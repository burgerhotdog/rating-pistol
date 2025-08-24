import { Stack, Avatar, Typography, Tooltip, TableCell } from '@mui/material';
import { ErrorOutline, InfoOutlined } from '@mui/icons-material';
import { RATING_ASSETS } from '@assets';

const RATING_RANK = ['Excellent', 'Great', 'Good', 'Poor'];

const RatingCell = ({ gameId, setModalPipe, id, data, rating }) => {
  if (rating === undefined) return (
    <Tooltip title="Unable to calculate rating due to missing data">
      <ErrorOutline sx={{ color: 'error.main' }} />
    </Tooltip>
  );

  if (rating === null) {
    return (
      <Tooltip title={`This character is not affected by substats and thus cannot be rated`}>
        <InfoOutlined sx={{ color: 'text.disabled' }} />
      </Tooltip>
    );
  }

  const { score } = rating.avatar;
  const openModal = () => setModalPipe({ type: 'rating', id, data, rating });

  return (
    <TableCell>
      <Tooltip title="Show Details">
        <Stack
          onClick={openModal}
          display="inline-flex"
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ cursor: 'pointer' }}
        >
          <Avatar
            alt={RATING_RANK['']}
            src={RATING_ASSETS['']}
            sx={{ width: 32, height: 32 }}
          />
          <Typography variant="body2">
            {score.toFixed()}
          </Typography>
        </Stack>
      </Tooltip>
    </TableCell>
  );
};

export default RatingCell;
