import { Stack, Avatar, Typography, Tooltip, TableCell, ButtonBase } from '@mui/material';
import { ErrorOutline, InfoOutlined } from '@mui/icons-material';
import { RATING_ASSETS } from '@assets';
import { getBenchmarkSrc, getLetter } from '@utils';

const RatingCell = ({ gameId, setModalPipe, id, data, rating }) => {
  if (rating === undefined) return (
    <TableCell>
      <Tooltip title="Unable to calculate rating due to missing data">
        <ErrorOutline color="error" />
      </Tooltip>
    </TableCell>
  );

  if (rating === null) {
    return (
      <TableCell>
        <Tooltip title="This character is not affected by substats and cannot be rated">
          <InfoOutlined color="disabled" />
        </Tooltip>
      </TableCell>
    );
  }

  const { score, scoreMax } = rating;
  const benchmark = Math.round((score / scoreMax) * 100);
  const openModal = () => setModalPipe({ type: 'rating', id, data, rating });

  return (
    <TableCell>
      <Tooltip title="Show Details">
        <ButtonBase onClick={openModal}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar src={RATING_ASSETS[getBenchmarkSrc(benchmark)]} />
            <Typography variant="body2">
              {benchmark.toFixed()}% ({getLetter(benchmark)})
            </Typography>
          </Stack>
        </ButtonBase>
      </Tooltip>
    </TableCell>
  );
};

export default RatingCell;
