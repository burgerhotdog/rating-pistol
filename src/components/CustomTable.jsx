import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import { CHARACTER_LOOKUP } from '@/lookups';

export const CustomTable = () => {
  const { gameId, charId } = useParams();
  if (!CHARACTER_LOOKUP[gameId][charId].CRITERIA) return null;
  const rows = [
    { name: 'CRIT', diff: 2.9 },
    { name: 'ATK', diff: 1.7 },
  ];

  const headers = ['Substat', '%diff'];

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
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <Typography variant="body2">{row.name}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2">{row.diff}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
