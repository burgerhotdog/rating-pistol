import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import { GENERAL_LOOKUP } from '@/lookups';
import { computeDamage } from '@/utils';

export const CustomTable = ({ build, rating, buffs, isLoading }) => {
  const { gameId, charId } = useParams();
  const { SUB_STAT_TYPES } = GENERAL_LOOKUP[gameId];
  if (isLoading || !build) return null;

  const newRatings = Object.entries(SUB_STAT_TYPES)
    .map(([id, { VALUE }]) => {
      const newRating = computeDamage(gameId, [charId, build], { ...buffs, [id]: (buffs[id] ?? 0) + VALUE});
      return {
        name: id,
        diff: newRating / rating * 100 - 100,
      };
    })
    .filter(({ diff }) => diff)
    .sort(({ diff: a }, { diff: b }) => b - a);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
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
                <Typography variant="body2">{name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{diff.toFixed(1)}%</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
