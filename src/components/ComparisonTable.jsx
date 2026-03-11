import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';

export const ComparisonTable = () => {
  const rows = [
    { name: 'Base', values: ['496388', '499694', '507118', '511609', '508441'] },
    { name: 'DMG/Result gain over base', values: ['-', '+3307', '+10730', '+15222', '+12053'] },
    { name: '% gain over base', values: ['-', '+0.67%', '+2.16%', '+3.07%', '+2.43%'] },
    { name: 'New leaderboard ranking', values: ['1698', '1462 (+236)', '1021 (+677)', '826 (+872)', '951 (+747)'] },
  ];

  const headers = ['Substat name', 'Flat ATK', 'ATK%', 'Crit RATE', 'Crit DMG'];

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
              {row.values.map((value, idx) => (
                <TableCell key={idx} align="center">
                  <Typography variant="body2">{value}</Typography>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
