import { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import { GENERAL_LOOKUP, CHARACTER_LOOKUP } from '@/lookups';
import { BuildContext } from '@/contexts';
import { computeDamage, combineEquipStats } from '@/utils';

export const CustomTable = () => {
  const { gameId, charId } = useParams();
  const { buildCollections } = useContext(BuildContext);
  const charBuild = buildCollections[gameId]?.[charId] ?? null;
  const damage = computeDamage(gameId, charId, charBuild);

  const unsortedData = {};
  for (const stat in GENERAL_LOOKUP[gameId].SUB_STAT_TYPES) {
    const newBuild = {
      weaponId: charBuild.weaponId,
      equipList: charBuild.equipList.map((equipObj, index) => {
        if (index !== 0) return equipObj;
        return {
          ...equipObj,
          subStatList: [
            ...equipObj.subStatList,
            { subStatId: stat, subStatValue: GENERAL_LOOKUP[gameId].SUB_STAT_TYPES[stat].VALUE },
          ],
        };
      }),
    };
    unsortedData[stat] = computeDamage(gameId, charId, newBuild);
  }

  const sorted = Object.entries(unsortedData)
    .map(([id, dmg]) => ({ name: id, diff: dmg / damage * 100 - 100 }))
    .sort(({ diff: a }, { diff: b }) => b - a);

  const headers = ['+1 Substat', '% diff'];

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2" fontWeight="bold">
                {headers[0]}
              </Typography>
            </TableCell>
            {headers.slice(1).map((header) => (
              <TableCell key={header} align="center">
                <Typography variant="subtitle2" fontWeight="bold">
                  {header}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <Typography variant="body2">{row.name}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2">{row.diff.toFixed(1)}%</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
