import { Box } from '@mui/material';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend } from 'recharts';

// Mock data for the radar chart
const rawData = [
  { stat: 'HP', character: 1000, top1Percent: 2000 },
  { stat: 'ATK', character: 120, top1Percent: 140 },
  { stat: 'DEF', character: 98, top1Percent: 130 },
  { stat: 'SPD', character: 99, top1Percent: 140 },
  { stat: 'CRIT Rate', character: 85, top1Percent: 145 },
];

const radarData = rawData.map((entry) => ({
  stat: entry.stat,
  character: (entry.character / entry.top1Percent) * 100,
  top1Percent: 100,
}));

export const RadarChartTest = () => {
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
          name="Top 1% Builds"
          dataKey="top1Percent"
          stroke="#ffffff"
          fillOpacity={0.3}
          dot={false}
        />
        <Legend />
      </RadarChart>
    </Box>
  );
};