import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  CardHeader,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Scatter,
  ScatterChart,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { FlexCard, ChartFill, Dot } from '@/components';
import { CHARACTER } from '@/data';
import { formatNum, formatDmg } from '@/utils';

function createData(summary, memberStack, isRunningTotal = false) {
  const runtimeDamage = {};
  for (const { runtime, ownerId, damage = 0 } of summary) {
    if (damage <= 0) continue;

    runtimeDamage[runtime] ??= { time: runtime };
    runtimeDamage[runtime][ownerId] ??= 0;
    runtimeDamage[runtime][ownerId] += damage;
  }

  if (isRunningTotal) {
    runtimeDamage[0] ??= { time: 0 };
    for (const id of memberStack) runtimeDamage[0][id] ??= 0;
  }

  const data = Object.values(runtimeDamage);

  if (isRunningTotal) {
    for (let i = 0; i < data.length; i++) {
      const curr = data[i];
      for (const id of memberStack) curr[id] ??= 0;
      if (i === 0) continue;

      const prev = data[i - 1];
      for (const id of memberStack) curr[id] += prev[id];
    }
  }

  return data;
}

const TooltipContent = ({ time, rows }) => {
  const timeStr = (time / 1000).toFixed(1);
  const total = rows.reduce((acc, { value }) => acc + value, 0);
  const totalStr = formatNum(total);

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
        Time: {timeStr}s
      </Typography>

      {rows.map(({ dataKey, color, name, value }) => (
        <Box
          key={dataKey}
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

          <Typography variant="body2">{formatNum(value)}</Typography>
        </Box>
      ))}

      {rows.length > 1 && (
        <>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Typography variant="subtitle2">Total:</Typography>
            <Typography variant="subtitle2">{totalStr}</Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export const Timeline = ({ userSummary, team }) => {
  const { gameId } = useParams();
  const { palette, accentColors } = useTheme();
  const [isRunningTotal, setIsRunningTotal] = useState(true);
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

  const data = createData(userSummary, memberStack, isRunningTotal);
  const axisProps = (
    <>
      <defs>
        {[...(new Set(Object.values(memberColors)))].map((color) => (
          <linearGradient key={color} id={`gradient${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.2} />
          </linearGradient>
        ))}
      </defs>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke={palette.divider}
      />
      <XAxis
        dataKey="time"
        type="number"
        domain={[0, 'dataMax']}
        tick={{ fontSize: 12 }}
        tickFormatter={(time) => `${(time / 1000).toFixed()}s`}
      />
      <YAxis
        tick={{ fontSize: 12 }}
        tickFormatter={formatDmg}
        label={{
          value: 'Damage',
          angle: -90,
          position: 'insideLeft',
          fontSize: 12,
        }}
        width="auto"
      />
    </>
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
        action={
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={isRunningTotal}
                onChange={(e) => setIsRunningTotal(e.target.checked)}
              />
            }
            label={
              <Typography variant="caption" color="textSecondary">
                Running Total
              </Typography>
            }
          />
        }
        disableTypography
      />

      <ChartFill flex={3}>
        {isRunningTotal ? (
          <AreaChart
            data={data}
            margin={{ top: 16, right: 16, left: 16, bottom: 16 }}
          >
            {axisProps}

            {memberStack.toReversed().map((id) => {
              const color = memberColors[id];
              return (
                <Area
                  key={id}
                  dataKey={id}
                  activeDot={false}
                  fill={`url(#gradient${color})`}
                  name={gameCharacters[id]?.name ?? 'Other'}
                  stackId="members"
                  stroke={color}
                  strokeOpacity={0}
                  type="monotone"
                />
              );
            })}

            <ChartTooltip
              content={({ payload }) => {
                return (
                  <TooltipContent
                    time={payload[0]?.payload?.time}
                    rows={payload.toReversed()}
                  />
                );
              }}
            />
          </AreaChart>
        ) : (
          <ScatterChart
            data={data}
            margin={{ top: 16, right: 16, left: 16, bottom: 16 }}
          >
            {axisProps}

            {memberStack.map((id) => {
              const color = memberColors[id];
              return (
                <Scatter
                  key={id}
                  dataKey={id}
                  name={gameCharacters[id]?.name ?? 'Other'}
                  fill={color}
                />
              );
            })}

            <ChartTooltip
              isAnimationActive={false}
              content={({ payload }) => {
                const time = payload[0]?.value ?? 0;
                const rows = payload[1] ? [payload[1]] : [];

                return (
                  <TooltipContent
                    time={time}
                    rows={rows}
                  />
                );
              }}
            />
          </ScatterChart>
        )}
      </ChartFill>
    </FlexCard>
  );
};
