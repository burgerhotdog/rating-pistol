import { useParams } from 'react-router-dom';
import { Card, Box, Paper, Tooltip as MuiTooltip, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarRadiusAxis, PolarAngleAxis, Tooltip, Legend } from 'recharts';
import { useBuild } from '@/contexts';
import { CHARACTERS, MISC } from '@/data';
import { computeTotalStat, mergeStatMaps, compileStatMap } from '@/utils';
import { useTheme } from '@mui/material/styles';

export const CustomRadarChart = ({ combinedSimEquips, isLoading }) => {
  const { gameId, characterId } = useParams();
  const build = useBuild().getBuilds(gameId)[characterId];
  const theme = useTheme();
  const disabledColor = theme.palette.action.disabled;
  const element = CHARACTERS[gameId]?.[characterId]?.element;
  const elementColor = MISC[gameId]?.ELEMENT_COLORS?.[element];
  const calcs = CHARACTERS[gameId][characterId]?.calcs;

  if (isLoading || !build || !combinedSimEquips) return null;
  const simSources = Object.entries(combinedSimEquips).map(([statId, value]) => ({
    mainStatId: statId,
    mainStatValue: value,
    subStatList: []
  }));

  const offElements = Object.keys(MISC[gameId].ELEMENT_COLORS).filter(e => e !== element);

  const data = Object.entries(MISC[gameId].MENU_STATS)
    .filter(([stat]) => element === 'PHYSICAL'
      ? !offElements.includes(stat)
      : !offElements.includes(stat) && stat !== 'PHYSICAL'
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
    <Card sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 2, pt: 1.5, pb: 0 }}>
        <Typography variant="subtitle2" fontWeight="bold">Stat Distribution</Typography>
        <MuiTooltip title="Compares your build's stat totals against the benchmark's average. The gray area is the target — stats that extend beyond it are over-invested." placement="top" arrow>
          <HelpOutlineIcon sx={{ fontSize: 13, color: 'text.disabled', cursor: 'help' }} />
        </MuiTooltip>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius={100} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="stat" />
          <PolarRadiusAxis axisLine={false} tick={false} domain={[0, 100]} allowDataOverflow />
          <Radar
            name="You"
            dataKey="build"
            stroke={elementColor}
            fill={elementColor}
            fillOpacity={0.6}
            allowDataOverflow
          />
          <Radar
            name="Benchmark"
            dataKey="sim"
            stroke={disabledColor}
            fill={disabledColor}
            fillOpacity={0.15}
          />
          <Legend
            verticalAlign="top"
            height={28}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12 }}
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
                    {MISC[gameId].MENU_STATS[label].label}
                  </Typography>
                  {payload.map((entry) => {
                    const { isPercent } = MISC[gameId].MENU_STATS[label];
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
      </Box>
      </Box>
    </Card>
  );
};
