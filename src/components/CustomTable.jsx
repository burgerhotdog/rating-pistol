import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, Paper } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { STATS, CHARACTERS } from '@/data';
import { computeDamage } from '@/utils';
import { useTheme } from '@mui/material/styles';

export const CustomTable = ({ gameId, characterId, build, rating, team, isLoading }) => {
  const theme = useTheme();
  const element = CHARACTERS[gameId]?.[characterId]?.element;
  const elementColor = STATS[gameId]?.ELEMENT_COLORS?.[element] ?? '#8884d8';
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

  const maxDiff = newRatings.length ? newRatings[0].diff : 1;

  return (
    <Card sx={{ flex: 1, overflow: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 2, pt: 1.5, pb: 0.5 }}>
        <Typography variant="subtitle2" fontWeight="bold">Substat Priority</Typography>
        <Tooltip title="Damage increase from gaining one extra roll of each substat. Prioritize farming for the stats at the top." placement="top" arrow>
          <HelpOutlineIcon sx={{ fontSize: 13, color: 'text.disabled', cursor: 'help' }} />
        </Tooltip>
      </Box>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="caption" color="text.secondary">
                  +1 Roll
                </Typography>
              </TableCell>
              <TableCell sx={{ width: 140 }}>
                <Typography variant="caption" color="text.secondary">
                  Damage Impact
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newRatings.map(({ name, diff }) => {
              const barWidth = Math.min((diff / maxDiff) * 100, 100);
              return (
                <TableRow key={name}>
                  <TableCell>
                    <Typography variant="body2">{SUB_STAT_TYPES[name].NAME}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        height: 6,
                        borderRadius: 3,
                        width: `${barWidth}%`,
                        minWidth: 4,
                        backgroundColor: elementColor,
                        opacity: 0.4 + 0.6 * (diff / maxDiff),
                      }} />
                      <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                        +{diff.toFixed(2)}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};
