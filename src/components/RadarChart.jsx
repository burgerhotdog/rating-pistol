import { useParams } from 'react-router-dom';
import { Card, Box, Paper, Typography } from '@mui/material';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip as ChartTooltip } from 'recharts';
import { CHARACTER_LOOKUP, GENERAL_LOOKUP } from '@/lookups';
import { buildSourceMapList, computeTotalStat } from '@/utils';

const statList = ['HP', 'ATK', 'DEF', 'EM', 'ER', 'CR', 'CD'];

export const CustomRadarChart = ({ charId, build, combinedSimEquips, isLoading }) => {
  const { gameId } = useParams();
  if (isLoading || !build || !combinedSimEquips) return null;
  const buildSources = buildSourceMapList(gameId, charId, build);
  const simSources = buildSources.toSpliced(3, 1, combinedSimEquips);

  const data = statList.map((stat) => {
    const buildRaw = computeTotalStat(stat, buildSources);
    const simRaw = computeTotalStat(stat, simSources)
    return {
      stat,
      build: buildRaw / simRaw * 100,
      buildRaw,
      sim: 100,
      simRaw,
    };
  });

  return (
    <Card sx={{ flex: 1, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart outerRadius={100} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="stat" />
          <Radar
            name="You"
            dataKey="build"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Radar
            name="Week 20 Avg"
            dataKey="sim"
            stroke="gold"
            fill="gold"
            fillOpacity={0.1}
          />
          <ChartTooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null;
              const fullEntry = payload[0].payload;
              return (
                <Paper
                  elevation={3}
                  sx={{
                    p: 1.5,
                    minWidth: 0,
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    {GENERAL_LOOKUP[gameId].MENU_STAT[label].label}
                  </Typography>
                  {payload.map((entry) => {
                    const { isPercent } = GENERAL_LOOKUP[gameId].MENU_STAT[label];
                    const totalValue = fullEntry[`${entry.dataKey}Raw`];
                    const displayValue = isPercent ? totalValue * 100 : totalValue;
                    const toFixedValue = isPercent || (gameId === 'zenless-zone-zero' && id === 'ER') ? 1 : 0;
                    return (
                      <Box key={entry.dataKey} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                        <Typography variant="body2">{entry.name}: </Typography>
                        <Typography variant="body2">
                          {displayValue.toFixed(toFixedValue) + (isPercent ? '%' : '')}
                        </Typography>
                      </Box>
                    )
                  })}
                </Paper>
              );
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
};
