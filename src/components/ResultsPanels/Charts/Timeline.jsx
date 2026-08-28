import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
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
import { useData } from '@/hooks';
import { formatDmg, formatNum } from '@/utils';

function buildData(summary, memberStack, isRunningTotal, isCurrOnly, currId) {
  const filteredSummary = summary.filter(({ ownerId, field, damage = 0 }) => {
    if (!isCurrOnly) return damage > 0;

    if (ownerId !== currId || field !== 'onField') return;
    return damage > 0;
  });

  const runtimeOffset = (isCurrOnly && filteredSummary.length)
    ? filteredSummary[0].runtime
    : 0;

  const runtimeDamage = {};
  for (const { runtime, ownerId, damage, hitOffsets, name } of filteredSummary) {
    if (hitOffsets?.length) {
      const initOffset = hitOffsets[0];
      const splitDamage = damage / hitOffsets.length;
      for (const offset of hitOffsets) {
        const offsetDiff = offset - initOffset;
        const adjustedRuntime = runtime + offsetDiff - runtimeOffset;
        runtimeDamage[adjustedRuntime] ??= { time: adjustedRuntime, name };
        runtimeDamage[adjustedRuntime][ownerId] ??= 0;
        runtimeDamage[adjustedRuntime][ownerId] += splitDamage;
      }
    } else {
      const adjustedRuntime = runtime - runtimeOffset;
      runtimeDamage[adjustedRuntime] ??= { time: adjustedRuntime, name };
      runtimeDamage[adjustedRuntime][ownerId] ??= 0;
      runtimeDamage[adjustedRuntime][ownerId] += damage;
    }
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

const TooltipContent = ({ time, name, rows }) => {
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
      <Typography variant="subtitle2">{name}</Typography>
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
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: color,
                flexShrink: 0,
              }}
            />
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

const popCrossfade = (items, animationElapsedTime) => {
  if (items == null) return [];
  if (animationElapsedTime === 1) {
    return items.flatMap((item) => (item.status === 'removed' ? [] : [item.next]));
  }

  const result = [];
  for (const item of items) {
    if (item.status === 'matched' || item.status === 'added') {
      const { next } = item;
      result.push({
        ...next,
        opacity: animationElapsedTime,
        size: next.size * animationElapsedTime * animationElapsedTime,
      });
    }
    if (item.status === 'matched' || item.status === 'removed') {
      const { prev } = item;
      result.push({
        ...prev,
        opacity: 1 - animationElapsedTime,
        size: prev.size * (1 - animationElapsedTime) * (1 - animationElapsedTime),
      });
    }
  }
  return result;
};

const Timeline = ({ results }) => {
  const { userSummary, memberIds } = results;

  const { charId } = useParams();
  const { palette } = useTheme();
  const [isRunningTotal, setIsRunningTotal] = useState(true);
  const [isCurrOnly, setIsCurrOnly] = useState(false);
  const handleCheckbox = (setter) => (event) => setter(event.target.checked);
  const charDatas = useData('character');
  const elementDatas = useData('element');
  const accentColor = elementDatas[charDatas[charId].element].color;

  const memberStack = [...memberIds];
  if (userSummary.some((ss) => ss.ownerId === 'other')) memberStack.push('other');

  const memberColors = Object.fromEntries(
    memberStack.map((id) => {
      const element = charDatas[id]?.element;
      return [id, elementDatas[element]?.color ?? '#ffffff'];
    })
  );

  const data = buildData(userSummary, memberStack, isRunningTotal, isCurrOnly, Number(charId));
  const totalDamage = userSummary.reduce((acc, { damage = 0 }) => acc + damage, 0);
  const duration = userSummary.reduce((max, { runtime = 0 }) => Math.max(max, runtime), 0);
  const teamDps = duration > 0 ? totalDamage / (duration / 1000) : null;
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
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title="Rotation Timeline"
        subheader={`${(duration / 1000).toFixed(1)}s rotation · ${formatNum(totalDamage)} dmg${teamDps != null ? ` · ${formatNum(teamDps)} DPS` : ''}`}
        action={
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRunningTotal}
                  onChange={handleCheckbox(setIsRunningTotal)}
                  sx={{ '&.Mui-checked': { color: accentColor } }}
                />
              }
              label="Show Running Total"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCurrOnly}
                  onChange={handleCheckbox(setIsCurrOnly)}
                  sx={{ '&.Mui-checked': { color: accentColor } }}
                />
              }
              label="Hide Teammates"
            />
          </>
        }
      />

      <CardContent component={Stack} sx={{ flex: 1 }}>
        {isRunningTotal ? (
          <AreaChart
            data={data}
            style={{ width: '100%', height: '100%' }}
            responsive
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
                  hide={isCurrOnly && id !== Number(charId)}
                  name={charDatas[id]?.name ?? 'Other'}
                  stackId="members"
                  stroke={color}
                  strokeOpacity={0}
                  type="monotone"
                />
              );
            })}

            <ChartTooltip
              content={({ payload }) => (
                <TooltipContent
                  time={payload[0]?.payload?.time}
                  rows={payload.toReversed()}
                />
              )}
            />
          </AreaChart>
        ) : (
          <ScatterChart
            data={data}
            style={{ width: '100%', height: '100%' }}
            responsive
          >
            {axisProps}

            {memberStack.map((id) => {
              const color = memberColors[id];
              return (
                <Scatter
                  key={id}
                  dataKey={id}
                  animationInterpolateFn={popCrossfade}
                  name={charDatas[id]?.name ?? 'Other'}
                  fill={color}
                />
              );
            })}

            <ChartTooltip
              isAnimationActive={false}
              content={({ payload }) => (
                <TooltipContent
                  time={payload[0]?.value ?? 0}
                  name={payload[0]?.payload?.name}
                  rows={payload[1] ? [payload[1]] : []}
                />
              )}
            />
          </ScatterChart>
        )}
      </CardContent>
    </Card>
  );
};

export default Timeline;
