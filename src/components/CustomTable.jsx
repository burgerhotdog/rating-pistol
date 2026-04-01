import { useParams } from 'react-router-dom';
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import { STATS, CHARACTERS } from '@/lookups';
import { computeRating } from '@/utils';

export const CustomTable = ({ build, rating, buffs, isLoading }) => {
  const { gameId, characterId } = useParams();
  const { SUB_STAT_TYPES } = STATS[gameId];
  const { CRITERIA } = CHARACTERS[gameId][characterId];
  if (isLoading || !CRITERIA || !build) return null;

  const newRatings = Object.entries(SUB_STAT_TYPES)
    .map(([id, { VALUE }]) => {
      const newRating = computeRating(gameId, characterId, build, CRITERIA[0], { ...buffs, [id]: (buffs[id] ?? 0) + VALUE});
      return {
        name: id,
        diff: newRating / rating * 100 - 100,
      };
    })
    .filter(({ diff }) => diff)
    .sort(({ diff: a }, { diff: b }) => b - a);

  return (
    <Card sx={{ flex: 1 }}>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  +1 Substat
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  % diff
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newRatings.map(({ name, diff }) => (
              <TableRow key={name}>
                <TableCell>
                  <Typography variant="body2">{SUB_STAT_TYPES[name].NAME}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{diff.toFixed(1)}%</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};
