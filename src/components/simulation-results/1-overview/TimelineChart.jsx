import { memo } from 'react';
import { Avatar, Divider, Paper, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useData } from '@/hooks';
import { formatDmg, formatNum, formatStr } from '@/utils';

function buildData(snapshots, areaStack, userRotationTime, userRotationTimeSource) {
  const roundedUserRotationTime = Math.round(userRotationTime);
  const runtimeDamage = {};

  const sorted = snapshots.toSorted((a, b) => a.runtime - b.runtime);

  const adjustmentRatios = Object.fromEntries(
    Object.entries(userRotationTimeSource)
      .map(([id, { duration, added }]) => {
        const ratio = (duration + added) / duration;
        return [id, ratio];
      })
  );

  let prevOnFieldId = sorted[0].onFieldId;
  let rawOnFieldOffset = 0;
  let adjustedOnFieldOffset = 0;

  for (const { onFieldId, runtime, ownerId, damageType, damage } of sorted) {
    if (onFieldId !== prevOnFieldId) {
      const { duration, added } = userRotationTimeSource[prevOnFieldId];
      prevOnFieldId = onFieldId;
      rawOnFieldOffset += duration;
      adjustedOnFieldOffset += duration + added;
    }

    if (!damage) continue;

    const dataKey = ownerId === 'system' ? damageType : ownerId;

    const adjustmentRatio = adjustmentRatios[onFieldId];
    const partToAdjust = runtime - rawOnFieldOffset;
    const adjustedRuntime = adjustedOnFieldOffset + partToAdjust * adjustmentRatio;

    const time = Math.min((Math.floor(adjustedRuntime / 1000) + 1) * 1000, roundedUserRotationTime);

    runtimeDamage[time] ??= { time };
    runtimeDamage[time][dataKey] = (runtimeDamage[time][dataKey] ?? 0) + damage;
  }

  runtimeDamage[0] ??= { time: 0 };
  runtimeDamage[roundedUserRotationTime] ??= { time: roundedUserRotationTime };
  for (const { dataKey } of areaStack) {
    runtimeDamage[0][dataKey] ??= 0;
  }

  const data = Object.values(runtimeDamage).sort((a, b) => a.time - b.time);
  
  for (let i = 0; i < data.length; i++) {
    const curr = data[i];

    for (const { dataKey } of areaStack) {
      curr[dataKey] ??= 0;
    }

    if (i === 0) continue;

    const prev = data[i - 1];

    for (const { dataKey } of areaStack) {
      curr[dataKey] += prev[dataKey];
    }
  }

  let currTime = 0;
  const filled = [data[0]];

  for (const point of data.slice(1)) {
    while (currTime < point.time - 1000) {
      currTime += 1000;
      filled.push({
        ...filled.at(-1),
        time: currTime,
      });
    }

    filled.push(point);
    currTime = point.time;
  }

  return filled;
}

const tooltipContent = ({ payload }, areaStack) => {
  if (!payload?.[0]?.payload) return;

  const { time } = payload[0].payload;
  const rows = payload.toReversed();
  const total = rows.reduce((acc, { value }) => acc + value, 0);

  return (
    <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
      <Typography variant="subtitle2" color="textSecondary">
        Time: {parseFloat((time / 1000).toFixed(1))}s
      </Typography>

      {rows.map(({ dataKey, name, value }) => {
        const { icon } = areaStack.find((entry) => entry.dataKey === dataKey);

        return (
          <Stack
            key={dataKey}
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <Avatar
                src={icon}
                sx={{ width: 20, height: 20, visibility: icon ? 'visible' : 'hidden' }}
              />
              <Typography variant="body2" color="textSecondary">
                {name}:
              </Typography>
            </Stack>

            <Typography variant="body2">
              {formatNum(value)}
            </Typography>
          </Stack>
        );
      })}

      {rows.length > 1 && (
        <>
          <Divider />
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Typography variant="subtitle2">
              Total:
            </Typography>
            <Typography variant="subtitle2">
              {formatNum(total)}
            </Typography>
          </Stack>
        </>
      )}
    </Paper>
  );
};

const RotationTimeline = ({
  memberIds,
  userSnapshots,
  userRotationTime,
  userRotationTimeSource,
}) => {
  const { palette } = useTheme();
  const charDatas = useData('character');
  const elementDatas = useData('element');

  if (
    !memberIds ||
    !userSnapshots ||
    !userRotationTime ||
    !userRotationTimeSource
  ) return;

  const areaStack = [
    ...memberIds.map((id) => {
      const { name, element, icon } = charDatas[id];
      const { color } = elementDatas[element];
      return {
        dataKey: id,
        name,
        color,
        icon,
      };
    }),
    ...Object.entries(userSnapshots
      .reduce((acc, { ownerId, damageType, damage }) => {
        if (ownerId === 'system') {
          acc[damageType] = damage;
        }
        return acc;
      }, {}))
      .sort(([, a], [, b]) => b - a)
      .map(([damageType]) => ({
        dataKey: damageType,
        name: formatStr(damageType),
        color: '#ffffff',
      })),
  ];

  const data = buildData(userSnapshots, areaStack, userRotationTime, userRotationTimeSource);
  const maxSecond = Math.floor(userRotationTime / 1000);
  const interval = Math.max(1, Math.ceil(maxSecond / 6));
  const ticks = [];

  for (let second = 0; second < maxSecond; second += interval) {
    ticks.push(second * 1000);
  }

  if (ticks.at(-1) !== userRotationTime) {
    ticks.push(userRotationTime);
  }

  return (
    <AreaChart
      data={data}
      responsive
      style={{ width: '100%', height: '100%' }}
    >
      <CartesianGrid
        stroke={palette.divider}
        strokeDasharray="3 3"
      />

      <XAxis
        type="number"
        dataKey="time"
        domain={[0, userRotationTime]}
        tick={{ fontSize: 12 }}
        ticks={ticks}
        tickFormatter={(time) => `${parseFloat((time / 1000).toFixed(1))}s`}
      />

      <YAxis
        domain={[0, 'dataMax']}
        tick={{ fontSize: 12 }}
        tickFormatter={formatDmg}
      />

      {areaStack.toReversed().map(({ dataKey, name, color }) => (
        <Area
          key={dataKey}
          dataKey={dataKey}
          activeDot={false}
          fill={`url(#gradient-${color})`}
          name={name}
          stackId="stack"
          stroke={color}
          type="monotone"
        />
      ))}

      <Tooltip
        content={(props) => tooltipContent(props, areaStack)}
        isAnimationActive={false}
      />

      <defs>
        {[...(new Set(areaStack.map(({ color }) => color)))].map((color) => (
          <linearGradient key={color} id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        ))}
      </defs>
    </AreaChart>
  );
};

export default memo(RotationTimeline);
