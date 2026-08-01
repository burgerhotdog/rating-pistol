import { useParams } from 'react-router-dom';
import {
  Box,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
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
import { sumRotationDmg, formatNum, formatDmg } from '@/utils';

const InfoLabel = ({ label, tip }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
    }}
  >
    <Typography
      variant="overline"
      color="textSecondary"
      sx={{ lineHeight: 1.4 }}
    >
      {label}
    </Typography>

    <Tooltip
      title={tip}
    >
      <HelpOutlineOutlinedIcon
        color="disabled"
      />
    </Tooltip>
  </Box>
);

function toGroupedSummary(summary, interval = 1000) {
  const intervals = [];
  for (const snapshot of summary) {
    const { ownerId, runtime } = snapshot;
    const index = Math.ceil(runtime / interval);
    intervals[index] ??= {};
    const acc = intervals[index];
    
    acc[ownerId] ??= {};
    const ownerAcc = acc[ownerId];
    for (const part of ['damage', 'healing', 'shield']) {
      if (part in snapshot) {
        ownerAcc[part] ??= 0;
        ownerAcc[part] += snapshot[part];
      }
    }
  }
  const length = intervals.length;
  for (let i = 0; i < length; i++) intervals[i] ??= {};
  return intervals;
}

function accGroupedSummary(grouped, owners) {
  const acc = Object.fromEntries(
    owners.map((ownerId) => [ownerId, 0])
  );

  return grouped.map((interval) => {
    if (interval) {
      for (const [ownerId, parts] of Object.entries(interval)) {
        if (!('damage' in parts)) continue;
        acc[ownerId] += parts.damage;
      }
    }

    return { ...acc };
  });
}

export const Timeline = ({ userSummary, team }) => {
  const { gameId } = useParams();
  const { palette, accentColors } = useTheme();
  const disabledColor = palette.action.disabled;

  const members = [
    ...team.filter((member) => member.id),
    ...(userSummary.some((snapshot) => snapshot.ownerId === 'other')
      ? [{ id: 'other' }]
      : []),
  ];

  const memberColors = members.toReversed().map((member) => {
    if (member.id === 'other') return '#ffffff';
    const { element } = CHARACTER[gameId][member.id];

    return accentColors[gameId][element] ?? disabledColor;
  });

  const totalDamage = sumRotationDmg(userSummary);
  const groupedSummary = toGroupedSummary(userSummary);
  const accGroups = accGroupedSummary(groupedSummary, members.map((member) => member.id));
  const data = accGroups.map((group, index) => ({ ...group, time: index }));

  const yMin = 0;
  const yMax = totalDamage * 1.05;

  return (
    <FlexCard direction="row">
      <ChartFill flex={3}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
        >
          <defs>
            {memberColors.map((color, i) => (
              <linearGradient key={i} id={`gradient2Member${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                <stop offset="100%" stopColor={color} stopOpacity={0.2} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={palette.divider} />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            label={{ value: 'Time', position: 'insideBottomRight', offset: -5, fontSize: 12 }}
          />

          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 12 }}
            tickFormatter={formatDmg}
            label={{ value: 'Damage', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />

          {/* Stacked member DPS areas */}
          {members.toReversed().map((member, index) => (
            <Area
              key={member.id}
              type="monotone"
              dataKey={member.id}
              stackId="members"
              stroke={memberColors[index]}
              strokeWidth={1.5}
              fill={`url(#gradient2Member${index})`}
              activeDot={false}
            />
          ))}
          
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;

              const { time, ...rest } = payload[0].payload;

              const damage = Object.values(rest).reduce((acc, damage) => acc + damage, 0);

              return (
                <Paper
                  elevation={4}
                  sx={{
                    p: 1.5,
                    minWidth: 160,
                    backgroundColor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Time: {time}s
                  </Typography>

                  {members.map((member, index) => {
                    return (
                      <Box
                        key={member.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Dot color={memberColors.toReversed()[index]} />

                          <Typography variant='body2'>
                            {CHARACTER[gameId][member.id]?.name ?? 'Other'}:
                          </Typography>
                        </Box>

                        <Typography variant='body2'>
                          {formatNum(rest[member.id])}
                        </Typography>
                      </Box>
                    );
                  })}

                  <Divider sx={{ my: 0.5 }} />

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Total:
                    </Typography>

                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {formatNum(damage)}
                    </Typography>
                  </Box>
                </Paper>
              );
            }}
          />
        </ComposedChart>
      </ChartFill>

      <Divider orientation="vertical" flexItem />

      <Stack
        spacing={1.5}
        sx={{ flex: 1, p: 2, minWidth: 150, justifyContent: 'center' }}
      >
        <Box>
          <InfoLabel
            label="Team Damage"
            tip="The team's total damage for one rotation."
          />

          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {formatNum(totalDamage)}
          </Typography>
        </Box>
      </Stack>
    </FlexCard>
  );
};
