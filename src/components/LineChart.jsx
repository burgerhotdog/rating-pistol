import { Card } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceDot } from 'recharts';

export const CustomLineChart = ({ weeklyRatings, rating, isLoading }) => {
  if (isLoading || !weeklyRatings) return null;

  const values = [...weeklyRatings, rating].filter(Number.isFinite);
  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const padding = Math.max((maxY - minY) * 0.1, 1);
  const niceMin = Math.floor((minY - padding) / 1000) * 1000;
  const niceMax = Math.ceil((maxY + padding) / 1000) * 1000;

  const data = weeklyRatings.map((rat, index) => ({ week: index, rating: rat }))

  return (
    <Card sx={{ flex: 1, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height={375}>
        <LineChart
          data={data}
          margin={{ top: 30, right: 50, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            type="number"
            label={{ value: 'Weeks', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis
            domain={[niceMin, niceMax]}
            tickFormatter={(value) => Math.round(value)}
            label={{ value: 'DPS', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />

          <ReferenceLine
            y={rating}
            stroke="red"
            strokeDasharray="3 3"
            label={{ value: 'You', position: 'right', fill: 'red' }}
          />
          <Line type="monotone" dataKey="rating" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
