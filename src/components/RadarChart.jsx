import { useParams } from 'react-router-dom';
import { Card } from '@mui/material';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend } from 'recharts';
import { buildSourceMapList, computeTotalStat } from '@/utils';

const statList = ['HP', 'ATK', 'DEF', 'EM', 'ER', 'CR', 'CD'];

export const CustomRadarChart = ({ charId, build, combinedSimEquips, isLoading }) => {
  const { gameId } = useParams();
  if (isLoading || !build || !combinedSimEquips) return null;
  const buildSources = buildSourceMapList(gameId, charId, build);
  const simSources = buildSources.toSpliced(3, 1, combinedSimEquips);

  const radarData = statList.map((stat) => {
    const buildTotalStat = computeTotalStat(stat, buildSources);
    const simTotalStat = computeTotalStat(stat, simSources);
    return {
      stat,
      character: buildTotalStat / simTotalStat * 100,
      week20: 100,
    };
  });

  return (
    <Card sx={{ flex: 1, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart outerRadius={90} data={radarData}>
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
      </ResponsiveContainer>
    </Card>
  );
};
