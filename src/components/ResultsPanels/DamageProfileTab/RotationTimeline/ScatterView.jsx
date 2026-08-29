import { Avatar, Paper, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useData } from '@/hooks';
import { formatDmg, formatNum } from '@/utils';

function buildData(snapshots) {
  const data = [];

  for (const { runtime, ownerId, damage, hitOffsets, name } of snapshots) {
    if (!damage) continue;

    if (!hitOffsets?.length) {
      data.push({ time: runtime, name, ownerId, [ownerId]: damage });
      continue;
    }

    const initOffset = hitOffsets[0];
    const splitDamage = damage / hitOffsets.length;

    for (const offset of hitOffsets) {
      const adjustedRuntime = runtime + offset - initOffset;
      data.push({ time: adjustedRuntime, name, ownerId, [ownerId]: splitDamage });
    }
  }

  return data;
}

const ScatterView = ({ results }) => {
  const { userSnapshots, memberIds } = results;
  const { palette } = useTheme();
  const charDatas = useData('character');
  const elementDatas = useData('element');

  const dataIds = [
    ...memberIds,
    ...(userSnapshots.some((ss) => ss.ownerId === 'other') && ['other']),
  ];

  const data = buildData(userSnapshots);
  const duration = userSnapshots.reduce((max, { runtime = 0 }) => Math.max(max, runtime), 0); // wrong

  return (
    <ScatterChart
      data={data}
      style={{ width: '100%', height: '100%' }}
      responsive
    >
      <CartesianGrid strokeDasharray="3 3" stroke={palette.divider} />

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

      {dataIds.map((id) => {
        const { name, element } = charDatas[id] ?? {};
        const { color } = elementDatas[element] ?? {};

        return (
          <Scatter
            key={id}
            dataKey={id}
            name={name ?? 'Other'}
            fill={color ?? '#ffffff'}
          />
        );
      })}

      <Tooltip
        content={({ payload }) => {
          const point = payload[0];
          if (!point) return null;

          const { name, ownerId } = point.payload;

          return (
            <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <Avatar
                    src={charDatas[ownerId]?.icon}
                    sx={{ width: 20, height: 20 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {name}:
                  </Typography>
                </Stack>
                <Typography variant="body2">
                  {formatNum(point.value)}
                </Typography>
              </Stack>
            </Paper>
          );
        }}
        isAnimationActive={false}
      />
    </ScatterChart>
  );
};

export default ScatterView;
