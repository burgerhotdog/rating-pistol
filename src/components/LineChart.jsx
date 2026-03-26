import { Card } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceDot } from 'recharts';

export const CustomLineChart = ({ weeklyRatings, rating, isLoading }) => {
  if (isLoading || !weeklyRatings) return null;

  // Find intersection
  let ratingPoint = null;
  if (weeklyRatings.length) {
    for (let i = 1; i < 21; i++) {
      const prev = weeklyRatings[i - 1];
      const curr = weeklyRatings[i];
      if ((prev < rating && curr >= rating) || (prev > rating && curr <= rating)) {
        const t = (rating - prev) / (curr - prev);
        ratingPoint = { x: i - 1 + t, y: rating };
        break;
      }
    }
  }

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
