import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend } from 'recharts';
import { CHARACTER_LOOKUP } from '@/lookups';

// Mock data for the radar chart
const rawData = [
  { stat: 'HP', character: 1000, week20: 2000 },
  { stat: 'ATK', character: 120, week20: 140 },
  { stat: 'DEF', character: 98, week20: 130 },
  { stat: 'SPD', character: 99, week20: 140 },
  { stat: 'CRIT Rate', character: 85, week20: 145 },
];

const radarData = rawData.map((entry) => ({
  stat: entry.stat,
  character: (entry.character / entry.week20) * 100,
  week20: 100,
}));

export const CustomRadarChart = () => {
  const { gameId, charId } = useParams();
  if (!CHARACTER_LOOKUP[gameId][charId].CRITERIA) return null;
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