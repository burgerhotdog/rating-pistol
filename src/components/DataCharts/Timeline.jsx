import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
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
import { ChartFill, Dot, FlexCard } from '@/components';
import { useCharData, useElementColors } from '@/hooks';
import { formatNum, formatDmg } from '@/utils';

function buildData(summary, memberStack, isRunningTotal, isCurrOnly, currId) {
  const filteredSummary = summary.filter(({ ownerId, field, damage = 0 }) => {
    if (!isCurrOnly) return damage > 0;

    if (ownerId !== currId || field !== 'onField') return;
    return damage > 0;
  });

  const runtimeOffset = isCurrOnly && filteredSummary.length
    ? filteredSummary[0].runtime
    : 0;

  const runtimeDamage = {};
  for (const { runtime, ownerId, damage } of filteredSummary) {
    const adjustedRuntime = runtime - runtimeOffset;

    runtimeDamage[adjustedRuntime] ??= { time: adjustedRuntime };
    runtimeDamage[adjustedRuntime][ownerId] ??= 0;
    runtimeDamage[adjustedRuntime][ownerId] += damage;
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
  const { charId } = useParams();
  const { palette } = useTheme();
  const [isRunningTotal, setIsRunningTotal] = useState(true);
  const [isCurrOnly, setIsCurrOnly] = useState(false);
  const handleCheckbox = (setter) => (event) => setter(event.target.checked);
  const charData = useCharData();
  const elementColors = useElementColors();

  const memberStack = team.filter((m) => m.id).map((m) => m.id);
  if (userSummary.some((ss) => ss.ownerId === 'other')) memberStack.push('other');

  const memberColors = Object.fromEntries(
    memberStack.map((id) => {
      const element = charData[id]?.element;
      return [id, elementColors[element] ?? '#ffffff'];
    })
  );

  const data = buildData(userSummary, memberStack, isRunningTotal, isCurrOnly, charId);
  const chartMargin = { top: 16, right: 32, left: 32, bottom: 16 };
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
        domain={[0, 'dataMax']}
        tick={{ fontSize: 12 }}
        tickFormatter={(time) => `${(time / 1000).toFixed()}s`}
        type="number"
      />
      <YAxis
        tick={{ fontSize: 12 }}
        tickFormatter={formatDmg}
        width="auto"
      />
    </>
  );

  return (
    <FlexCard>
      <CardHeader
        title="Damage Timeline"
        action={
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRunningTotal}
                  onChange={handleCheckbox(setIsRunningTotal)}
                />
              }
              label="Running Total"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCurrOnly}
                  onChange={handleCheckbox(setIsCurrOnly)}
                />
              }
              label="Hide Teammates"
            />
          </>
        }
      />

      <ChartFill flex={3}>
        {isRunningTotal ? (
          <AreaChart data={data} margin={chartMargin}>
            {axisProps}

            {memberStack.toReversed().map((id) => {
              const color = memberColors[id];
              return (
                <Area
                  key={id}
                  dataKey={id}
                  activeDot={false}
                  fill={`url(#gradient${color})`}
                  hide={isCurrOnly && id !== charId}
                  name={charData[id]?.name ?? 'Other'}
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
          <ScatterChart data={data} margin={chartMargin}>
            {axisProps}

            {memberStack.map((id) => {
              const color = memberColors[id];
              return (
                <Scatter
                  key={id}
                  dataKey={id}
                  name={charData[id]?.name ?? 'Other'}
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
