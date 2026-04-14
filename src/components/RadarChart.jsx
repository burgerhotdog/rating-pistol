import { Card, Box, Paper, Typography } from '@mui/material';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarRadiusAxis, PolarAngleAxis, Tooltip } from 'recharts';
import { CHARACTERS, STATS } from '@/data';
import { computeTotalStat, mergeStatMaps, compileStatMap } from '@/utils';

export const CustomRadarChart = ({ gameId, characterId, build, combinedSimEquips, isLoading }) => {
  const calcs = CHARACTERS[gameId][characterId]?.calcs;

  if (isLoading || !build || !combinedSimEquips) return null;
  const simSources = Object.entries(combinedSimEquips).map(([statId, value]) => ({
    mainStatId: statId,
    mainStatValue: value,
    subStatList: []
  }));

  const damageType = calcs?.[0].type.element;
  const nonDamageTypes = STATS[gameId].ELEMENT_TYPES
    .map(element => element.toUpperCase())
    .filter(element => element !== damageType);

  const data = Object.entries(STATS[gameId].MENU_STATS)
    .filter(([stat]) => damageType === 'PHYSICAL'
      ? !nonDamageTypes.includes(stat)
      : !nonDamageTypes.includes(stat) && stat !== 'PHYSICAL'
    )
    .filter(([stat]) => stat === 'HB' ? !calcs[0].type : true)
    .map(([stat]) => {
      const buildRaw = computeTotalStat(stat, compileStatMap(gameId, characterId, build, []));
      const simRaw = computeTotalStat(stat, compileStatMap(gameId, characterId, { weaponId: build.weaponId, equipList: simSources }, []));
      return {
        stat,
        build: buildRaw / simRaw * 75 || 0,
        buildRaw,
        sim: simRaw ? 75 : 0,
        simRaw,
      };
    });

  return (
    <Card sx={{ flex: 1, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height={400} style={{ overflow: 'visible' }}>
        <RadarChart outerRadius={100} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="stat" />
          <PolarRadiusAxis axisLine={false} tick={false} domain={[0, 100]} allowDataOverflow />
          <Radar
            name="You"
            dataKey="build"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
            allowDataOverflow
          />
          <Radar
            name="Week 20 Avg"
            dataKey="sim"
            stroke="gold"
            fill="gold"
            fillOpacity={0.1}
          />
          <Tooltip
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
                    {STATS[gameId].MENU_STATS[label].label}
                  </Typography>
                  {payload.map((entry) => {
                    const { isPercent } = STATS[gameId].MENU_STATS[label];
                    const totalValue = fullEntry[`${entry.dataKey}Raw`];
                    const displayValue = isPercent ? totalValue * 100 : totalValue;
                    const toFixedValue = isPercent || (gameId === 'zenless-zone-zero' && label === 'ER') ? 1 : 0;
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
