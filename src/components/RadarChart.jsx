import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend } from 'recharts';
import { GENERAL_LOOKUP, CHARACTER_LOOKUP, WEAPON_LOOKUP } from '@/lookups';
import { combineEquipStats, computeTotalStat } from '@/utils';

const statList = [
  'HP',
  'ATK',
  'DEF',
  'EM',
  'ER',
  'CR',
  'CD',
];

export const CustomRadarChart = ({ combinedCharBuild, avgFinalWeekStats, weaponId }) => {
  const { gameId, charId } = useParams();

  const sourceMapList = [
    GENERAL_LOOKUP[gameId].DEFAULT_STATS ?? {},
    CHARACTER_LOOKUP[gameId][charId].FIXED_STATS ?? {},
    WEAPON_LOOKUP[gameId][weaponId].FIXED_STATS ?? {},
  ];

  const createSlice = (stat) => ({
    stat,
    character: computeTotalStat(stat, [...sourceMapList, combinedCharBuild]).totalValue,
    week20: computeTotalStat(stat, [...sourceMapList, avgFinalWeekStats]).totalValue,
  });

  const formattedData = statList.map((stat) => createSlice(stat));

  const radarData = formattedData.map((entry) => ({
    stat: entry.stat,
    character: (entry.character / entry.week20) * 100,
    week20: 100,
  }));

  return (
    <Box sx={{ flex: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <RadarChart
        outerRadius={90}
        width={400}
        height={400}
        data={radarData}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="stat" />
        <Radar
          name="Character Stats"
          dataKey="character"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Radar
          name="Week 20 Builds"
          dataKey="week20"
          stroke="#ffffff"
          fillOpacity={0.3}
          dot={false}
        />
        <Legend />
      </RadarChart>
    </Box>
  );
};