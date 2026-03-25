import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceDot } from 'recharts';

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
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
        <Legend />

        {ratingPoint && (
          <ReferenceDot
            x={ratingPoint.x}
            y={ratingPoint.y}
            fill="red"
            r={6}
          />
        )}
        <Line type="monotone" dataKey="rating" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};
