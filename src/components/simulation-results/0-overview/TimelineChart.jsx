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
import { useData, usePageParams } from '@/hooks';
import { formatDmg, formatNum, formatStr } from '@/utils';

function buildAreaStack(memberIds, snapshots, gameId, charDatas, elemDatas) {
  const areaStack = memberIds.map((memberId) => {
    const { name, element, icon } = charDatas[memberId];
    const { color } = elemDatas[element];
    return { dataKey: memberId, name, color, icon };
  });

  const systemDamageTypes = {};
  for (const { ownerId, damageType, damage } of snapshots) {
    if (ownerId !== 'system') continue;
    systemDamageTypes[damageType] = (systemDamageTypes[damageType] ?? 0) + damage;
  }

  Object.entries(systemDamageTypes)
    .sort(([, a], [, b]) => b - a)
    .forEach(([damageType]) => {
      areaStack.push({
        dataKey: damageType,
        name: formatStr(damageType),
        color: '#ffffff',
        icon: `${gameId}/system/${damageType}.webp`,
      });
    });

  return areaStack;
};

function buildData(snapshots, areaStack) {
  const dataKeys = areaStack.map(({ dataKey }) => dataKey);
  const sortedSnaps = snapshots.toSorted((a, b) => a.runtime - b.runtime);
  const lastTime = 1000 + Math.floor(sortedSnaps.at(-1).runtime / 1000) * 1000;

  const data = [];
  let snapIndex = 0;

  for (let time = 0; time <= lastTime; time += 1000) {
    const prevBucket = data.at(-1);
    const bucket = { time };
    for (const dataKey of dataKeys) {
      bucket[dataKey] = prevBucket?.[dataKey] ?? 0;
    }

    while (sortedSnaps[snapIndex]?.runtime < time) {
      const { ownerId, damageType, damage } = sortedSnaps[snapIndex++];
      if (!damage) continue;

      const dataKey = ownerId === 'system' ? damageType : ownerId;
      bucket[dataKey] += damage;
    }

    data.push(bucket);
  }

  return data;
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

const RotationTimeline = ({ memberIds, userSnapshots }) => {
  const { gameId } = usePageParams();
  const { palette } = useTheme();
  const charDatas = useData('character');
  const elemDatas = useData('element');

  if (!memberIds || !userSnapshots) return;

  const areaStack = buildAreaStack(memberIds, userSnapshots, gameId, charDatas, elemDatas);
  const data = buildData(userSnapshots, areaStack);

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
        domain={[0, 'dataMax']}
        tick={{ fontSize: 12 }}
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
