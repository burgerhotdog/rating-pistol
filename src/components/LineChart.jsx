import { Box, Card, Divider, Paper, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { CHARACTERS, STATS } from "@/data";

export const CustomLineChart = ({ weeklyScores, rating, isLoading, gameId, characterId }) => {
  const theme = useTheme();
  const disabledColor = theme.palette.action.disabled;
  const element = CHARACTERS[gameId]?.[characterId]?.element;
  const elementColor = STATS[gameId]?.ELEMENT_COLORS?.[element] ?? '#8884d8';
  if (isLoading || !weeklyScores) return null;

  const benchmarkRating = weeklyScores[weeklyScores.length - 1];

  const data = weeklyScores.map((rat, index) => ({ week: index, rating: rat / benchmarkRating * 100 }));
  const scaledBuildRating = rating / benchmarkRating * 100;

  return (
    <Card sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
      <Box sx={{ flex: 3, minWidth: 0, position: 'relative' }}>
        <Box sx={{ position: 'absolute', inset: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
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
            stroke={elementColor}
            label={{ value: 'You', position: 'right', fill: elementColor }}
          />
          <Line type="monotone" dataKey="rating" stroke={disabledColor} activeDot={{ r: 8 }} />
          
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
                    You: {rating.toLocaleString('en-US', { maximumFractionDigits: 0 })} ({scaledBuildRating.toFixed(1)}%)
                  </Typography>
                </Paper>
              );
            }}
          />
        </LineChart>
        </ResponsiveContainer>
        </Box>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Stack spacing={1} sx={{ flex: 1, p: 2, minWidth: 150, justifyContent: 'center' }}>
        <Typography variant="overline" color="text.secondary">Your Score</Typography>
        <Typography variant="h5" fontWeight="bold">
          {rating?.toLocaleString('en-US', { maximumFractionDigits: 0 }) ?? '—'}
        </Typography>
        <Typography variant="overline" color="text.secondary">Potential</Typography>
        <Typography variant="h5" fontWeight="bold" color={scaledBuildRating >= 100 ? 'success.main' : 'warning.main'}>
          {scaledBuildRating.toFixed(1)}%
        </Typography>
        <Typography variant="overline" color="text.secondary">Benchmark</Typography>
        <Typography variant="h5" fontWeight="bold">
          {benchmarkRating?.toLocaleString('en-US', { maximumFractionDigits: 0 }) ?? '—'}
        </Typography>
      </Stack>
    </Card>
  );
};
