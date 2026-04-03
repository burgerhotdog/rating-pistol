import { Card, Paper, Typography } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

export const CustomLineChart = ({ weeklyRatings, rating, isLoading }) => {
  if (isLoading || !weeklyRatings) return null;

  const values = [...weeklyRatings, rating].filter(Number.isFinite);
  //const minY = Math.min(...values);
  //const maxY = Math.max(...values);
  //const padding = Math.max((maxY - minY) * 0.1, 1);
  //const niceMax = Math.ceil((maxY + padding) / 1000) * 1000;

  const benchmarkIndex = weeklyRatings.findIndex((current, index, arr) => {
    if (index === 0) return false;

    const previous = arr[index - 1];
    if (!Number.isFinite(previous) || previous <= 0) return false;

    const percentGain = ((current - previous) / previous) * 100;
    return percentGain < 1;
  });
  const benchmarkRating = weeklyRatings[benchmarkIndex === -1 ? 20 : benchmarkIndex] || 1;
  const cutoff = benchmarkIndex === -1 ? weeklyRatings.length : benchmarkIndex;

  const data = weeklyRatings.map((rat, index) => ({ week: index, rating: rat / benchmarkRating * 100 })).filter((_, index) => index <= cutoff);
  const scaledBuildRating = rating / benchmarkRating * 100;

  return (
    <Card sx={{ flex: 1, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 30, right: 50, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            label={{ value: 'Weeks', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis
            domain={[0, 100]}
            label={{ value: 'Potential', angle: -90, position: 'insideLeft' }}
          />

          <ReferenceLine
            y={scaledBuildRating > 100 ? 100 : scaledBuildRating}
            stroke="red"
            strokeDasharray="3 3"
            label={{ value: 'You', position: 'right', fill: 'red' }}
          />
          <Line type="monotone" dataKey="rating" stroke="#8884d8" activeDot={{ r: 8 }} />
          
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null;

              const { week, rating: currentRating } = payload[0].payload;
              const prevWeek = data[week - 1];
              const percentGain =
                prevWeek && prevWeek.rating !== 0
                  ? ((currentRating - prevWeek.rating) / prevWeek.rating) * 100
                  : null;

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
                    Week {week}
                  </Typography>
                  <Typography variant="subtitle2">
                    Average build potential: {currentRating.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color={percentGain >= 0 ? 'success.main' : 'error.main'}>
                    {percentGain && `${percentGain >= 0 ? '+' : ''}${percentGain.toFixed(1)}% vs Week ${week - 1}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You: {scaledBuildRating.toFixed(1)}%
                  </Typography>
                </Paper>
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
