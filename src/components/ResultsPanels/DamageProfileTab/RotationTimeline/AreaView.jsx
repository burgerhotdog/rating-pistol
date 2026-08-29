import { Box, Divider, Paper, Typography } from '@mui/material';
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

function buildData(summary, memberStack) {
  const filteredSummary = summary.filter(({ damage = 0 }) => damage > 0);

  const runtimeDamage = {};
  for (const { runtime, ownerId, damage, hitOffsets, name } of filteredSummary) {
    if (hitOffsets?.length) {
      const initOffset = hitOffsets[0];
      const splitDamage = damage / hitOffsets.length;
      for (const offset of hitOffsets) {
        const offsetDiff = offset - initOffset;
        const adjustedRuntime = runtime + offsetDiff;
        runtimeDamage[adjustedRuntime] ??= { time: adjustedRuntime, name };
        runtimeDamage[adjustedRuntime][ownerId] ??= 0;
        runtimeDamage[adjustedRuntime][ownerId] += splitDamage;
      }
    } else {
      runtimeDamage[runtime] ??= { time: runtime, name };
      runtimeDamage[runtime][ownerId] ??= 0;
      runtimeDamage[runtime][ownerId] += damage;
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

const TooltipContent = ({ time, name, rows }) => {
  const timeStr = (time / 1000).toFixed(1);
  const total = rows.reduce((acc, { value }) => acc + value, 0);
  const totalStr = formatNum(total);

  return (
    <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
      <Typography variant="subtitle2">
        {name}
      </Typography>
      <Typography variant="subtitle2" color="textSecondary">
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
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
            <Typography variant="caption" color="textSecondary">
              {name}:
            </Typography>
          </Box>

          <Typography variant="caption">
            {formatNum(value)}
          </Typography>
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
            <Typography variant="subtitle2">
              Total:
            </Typography>
            <Typography variant="subtitle2">
              {totalStr}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

const AreaView = ({ results }) => {
  const { userSummary, memberIds } = results;
  const { palette } = useTheme();
  const charDatas = useData('character');
  const elementDatas = useData('element');

  const memberStack = [...memberIds];
  if (userSummary.some((ss) => ss.ownerId === 'other')) memberStack.push('other');

  const memberColors = Object.fromEntries(
    memberStack.map((id) => {
      const element = charDatas[id]?.element;
      return [id, elementDatas[element]?.color ?? '#ffffff'];
    })
  );

  const data = buildData(userSummary, memberStack);
  const duration = userSummary.reduce((max, { runtime = 0 }) => Math.max(max, runtime), 0);
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
    </>
  );

  return (
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
            name={charDatas[id]?.name ?? 'Other'}
            stackId="members"
            stroke={color}
            strokeOpacity={0}
            type="monotone"
          />
        );
      })}

      <Tooltip
        content={({ payload }) => (
          <TooltipContent
            time={payload[0]?.payload?.time}
            rows={payload.toReversed()}
          />
        )}
        isAnimationActive={false}
      />
    </AreaChart>
  );
};

export default AreaView;
