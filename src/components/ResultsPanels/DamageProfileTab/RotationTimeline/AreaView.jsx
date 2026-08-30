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
import { formatDmg, formatNum } from '@/utils';

function buildData(snapshots, memberStack) {
  const runtimeDamage = {};

  for (const { runtime, ownerId, damage, hitOffsets, name } of snapshots) {
    if (!damage) continue;

    if (!hitOffsets?.length) {
      runtimeDamage[runtime] ??= { time: runtime, name };
      runtimeDamage[runtime][ownerId] ??= 0;
      runtimeDamage[runtime][ownerId] += damage;
      continue;
    }

    const initOffset = hitOffsets[0];
    const splitDamage = damage / hitOffsets.length;
    for (const offset of hitOffsets) {
      const offsetDiff = offset - initOffset;
      const adjustedRuntime = runtime + offsetDiff;
      runtimeDamage[adjustedRuntime] ??= { time: adjustedRuntime, name };
      runtimeDamage[adjustedRuntime][ownerId] ??= 0;
      runtimeDamage[adjustedRuntime][ownerId] += splitDamage;
    }
  }

  runtimeDamage[0] ??= { time: 0 };
  for (const id of memberStack) runtimeDamage[0][id] ??= 0;

  const data = Object.values(runtimeDamage);

  for (let i = 0; i < data.length; i++) {
    const curr = data[i];
    for (const id of memberStack) curr[id] ??= 0;
    if (i === 0) continue;

    const prev = data[i - 1];
    for (const id of memberStack) curr[id] += prev[id];
  }

  return data;
}

const AreaView = ({ results }) => {
  const { userSnapshots, memberIds } = results;
  const { palette } = useTheme();
  const charDatas = useData('character');
  const elementDatas = useData('element');

  const memberStack = [...memberIds];
  if (userSnapshots.some((ss) => ss.ownerId === 'other')) memberStack.push('other');

  const memberColors = Object.fromEntries(
    memberStack.map((id) => {
      const element = charDatas[id]?.element;
      return [id, elementDatas[element]?.color ?? '#ffffff'];
    })
  );

  const data = buildData(userSnapshots, memberStack);
  const duration = userSnapshots.reduce((max, { runtime = 0 }) => Math.max(max, runtime), 0);

  return (
    <AreaChart
      data={data}
      style={{ width: '100%', height: '100%' }}
      responsive
    >
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
        ticks={Array.from(
          { length: Math.floor(duration / 5000) + 1 },
          (_, i) => i * 5000,
        )}
        tick={{ fontSize: 12 }}
        tickFormatter={(time) => `${(time / 1000).toFixed()}s`}
        type="number"
      />

      <YAxis
        tick={{ fontSize: 12 }}
        tickFormatter={formatDmg}
      />

      {memberStack.toReversed().map((id) => {
        const color = memberColors[id];
        return (
          <Area
            key={id}
            dataKey={id}
            activeDot={false}
            fill={`url(#gradient${color})`}
            name={charDatas[id]?.name ?? 'Other'}
            stackId="members"
            stroke={color}
            strokeOpacity={0}
            type="monotone"
          />
        );
      })}

      <Tooltip
        content={({ payload }) => {
          const time = payload[0]?.payload?.time;
          const rows = payload.toReversed();
          const total = rows.reduce((acc, { value }) => acc + value, 0);

          return (
            <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Time: {(time / 1000).toFixed(1)}s
              </Typography>

              {rows.map(({ dataKey, name, value }) => (
                <Stack
                  key={dataKey}
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <Avatar
                      src={charDatas[dataKey]?.icon}
                      sx={{ width: 20, height: 20 }}
                    />
                    <Typography variant="body2" color="textSecondary">
                      {name}:
                    </Typography>
                  </Stack>

                  <Typography variant="body2">
                    {formatNum(value)}
                  </Typography>
                </Stack>
              ))}

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
        }}
        isAnimationActive={false}
      />
    </AreaChart>
  );
};

export default AreaView;
