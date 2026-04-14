import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import { STATS, CHARACTERS } from '@/data';
import { computeDamage } from '@/utils';

export const CustomTable = ({ gameId, characterId, build, rating, team, isLoading }) => {
  const { SUB_STAT_TYPES } = STATS[gameId];
  const { calcs } = CHARACTERS[gameId][characterId];
  if (isLoading || !calcs || !build) return null;

  const newRatings = Object.entries(SUB_STAT_TYPES)
    .map(([id, { VALUE }]) => {
      const newRating = computeDamage(gameId, characterId, { ...build, equipList: [...build.equipList, { mainStatId: id, mainStatValue: VALUE, subStatList: [] }] }, calcs[0], team);
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
