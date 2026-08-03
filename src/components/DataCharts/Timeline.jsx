import { useParams } from 'react-router-dom';
import {
  Box,
  CardHeader,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from 'recharts';
import { FlexCard, ChartFill, Dot } from '@/components';
import { CHARACTER } from '@/data';
import { formatNum, formatDmg } from '@/utils';

function createData(summary, accumulate = false) {
  const owners = new Set(summary.map((snapshot) => snapshot.ownerId));
  function init(time) {
    const entry = { time };
    for (const id of owners) entry[id] = 0;
    return entry;
  };

  const runtimeData = {};
  for (const { runtime, ownerId, damage = 0 } of summary) {
    if (damage <= 0) continue;

    runtimeData[runtime] ??= init(runtime);
    runtimeData[runtime][ownerId] += damage;
  }

  const data = Object.values(runtimeData);

  if (accumulate) {
    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const curr = data[i];
      for (const id of owners) curr[id] += prev[id];
    }
  }

  return data;
}

const ChartGradients = ({ colors }) => (
  <defs>
    {[...colors].map((color) => (
      <linearGradient key={color} id={`gradient${color}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={0.6} />
        <stop offset="100%" stopColor={color} stopOpacity={0.2} />
      </linearGradient>
    ))}
  </defs>
);

export const Timeline = ({ userSummary, team }) => {
  const { gameId } = useParams();
  const { palette, accentColors } = useTheme();
  const gameColors = accentColors[gameId];
  const gameCharacters = CHARACTER[gameId];

  const memberStack = team.filter((m) => m.id).map((m) => m.id);
  if (userSummary.some((ss) => ss.ownerId === 'other')) memberStack.push('other');

  const memberColors = Object.fromEntries(
    memberStack.map((id) => {
      const element = gameCharacters[id]?.element;
      return [id, gameColors[element] ?? '#ffffff'];
    })
  );

  return (
    <FlexCard>
      <CardHeader
        title={
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="subtitle1">
              Rotation Timeline
            </Typography>
          </Stack>
        }
        disableTypography
      />
      <ChartFill flex={3}>
        <ComposedChart
          data={createData(userSummary)}
          margin={{ top: 16, right: 16, left: 16, bottom: 16 }}
        >
          <ChartGradients colors={new Set(Object.values(memberColors))} />

          <CartesianGrid strokeDasharray="3 3" stroke={palette.divider} />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={formatDmg}
            label={{ value: 'Damage', angle: -90, position: 'insideLeft', fontSize: 12 }}
            width="auto"
          />

          {/* Stacked member DPS areas */}
          {memberStack.toReversed().map((id) => {
            const color = memberColors[id];
            return (
              <Area
                key={id}
                type="monotone"
                dataKey={id}
                stackId="members"
                stroke={color}
                strokeWidth={1.5}
                fill={`url(#gradient${color})`}
                activeDot={false}
              />
            );
          })}

          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const { time, ...rest } = payload[0].payload;
              const total = Object.values(rest).reduce((acc, damage) => acc + damage, 0);
              return (
                <Paper
                  elevation={4}
                  sx={{
                    p: 1.5,
                    minWidth: 160,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="subtitle2">
                    Runtime: {time}s
                  </Typography>

                  {memberStack.map((id) => {
                    const name = gameCharacters[id]?.name ?? 'Other';
                    const color = memberColors[id];
                    const damage = rest[id] ?? 0;
                    return (
                      <Box
                        key={id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Dot color={color} />
                          <Typography variant="body2">{name}:</Typography>
                        </Box>

                        <Typography variant="body2">
                          {formatNum(damage)}
                        </Typography>
                      </Box>
                    );
                  })}

                  <Divider />

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle2">
                      Total:
                    </Typography>

                    <Typography variant="subtitle2">
                      {formatNum(total)}
                    </Typography>
                  </Box>
                </Paper>
              );
            }}
          />
        </ComposedChart>
      </ChartFill>
    </FlexCard>
  );
};
