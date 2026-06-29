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
  ReferenceLine,
} from 'recharts';
import { FlexCard, ChartFill } from '@/components';
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
        fontSize="small"
        color="disabled"
      />
    </Tooltip>
  </Box>
);

const getGrade = (pct) => {
  if (pct > 100) return { grade: 'S', color: '#FFD700' };

  const bands = [
    { floor: 90, letter: 'A', color: '#4ade80' },
    { floor: 80, letter: 'B', color: '#86efac' },
    { floor: 70, letter: 'C', color: '#fbbf24' },
    { floor: 60, letter: 'D', color: '#f97316' },
  ];

  for (const { floor, letter, color } of bands) {
    if (pct >= floor) {
      const pos = pct - floor;
      const suffix = pos >= 7 ? '+' : pos < 3 ? '-' : '';
      return { grade: letter + suffix, color };
    }
  }

  return { grade: 'E', color: '#ef4444' };
};

export const ProgressChart = ({ weeklySummaries, team, userSummary, cache }) => {
  const { palette, accentColors } = useTheme();
  const { gameId } = useParams();
  const disabledColor = palette.action.disabled;
  if (!weeklySummaries) return null;

  const members = team.filter(member => member.id);
  const membersMisc = [
    ...members,
    ...(Object.values(userSummary).some(result => result.ownerId === 'misc') ? [{ id: 'misc' }] : []),
  ];

  const rotationTime = cache.fullRotationTime;
  const toDps = dmg => rotationTime > 0 ? dmg / rotationTime * 1000 : 0;

  const sortedMembers = [...membersMisc].sort((a, b) => {
    const aDps = toDps(sumRotationDmg(userSummary ?? {}, { ownerId: a.id }));
    const bDps = toDps(sumRotationDmg(userSummary ?? {}, { ownerId: b.id }));

    return bDps - aDps;
  });

  const memberColors = sortedMembers.toReversed().map(member => {
    if (member.id === 'misc') return '#ffffff';
    const { element } = CHARACTER[gameId][member.id];

    return accentColors[gameId][element] ?? disabledColor;
  });


  const activeScores = weeklySummaries.map(actionMap => toDps(sumRotationDmg(actionMap)));
  const benchmarkDps = activeScores[activeScores.length - 1];
  const userDps = toDps(sumRotationDmg(userSummary ?? {}));
  const scaledBuildRating = userDps / benchmarkDps * 100;

  const data = activeScores.map((dmg, index) => {
    const entry = {
      week: index,
      damage: dmg,
    };

    for (const m of membersMisc) {
      entry[`dps_${m.id}`] = toDps(sumRotationDmg(weeklySummaries[index], { ownerId: m.id }));
    }

    return entry;
  });

  const yMin = 0;
  const yMax = Math.max(benchmarkDps, userDps) * 1.05;

  const { grade, color: gradeColor } = getGrade(scaledBuildRating);

  return (
    <FlexCard direction="row">
      <ChartFill flex={3}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
        >
          <defs>
            {memberColors.map((color, i) => (
              <linearGradient key={i} id={`gradientMember${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                <stop offset="100%" stopColor={color} stopOpacity={0.2} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={palette.divider} />

          <XAxis
            dataKey="week"
            tick={{ fontSize: 12 }}
            label={{ value: 'Weeks', position: 'insideBottomRight', offset: -5, fontSize: 12 }}
          />

          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 12 }}
            tickFormatter={formatDmg}
            label={{ value: 'DPS', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />

          <ReferenceLine
            y={userDps}
            strokeWidth={2}
          />

          {/* Stacked member DPS areas */}
          {sortedMembers.toReversed().map((member, index) => (
            <Area
              key={member.id}
              type="monotone"
              dataKey={`dps_${member.id}`}
              stackId="members"
              stroke={memberColors[index]}
              strokeWidth={1.5}
              fill={`url(#gradientMember${index})`}
              activeDot={false}
            />
          ))}
          
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;

              const { week, damage } = payload[0].payload;
              const prevWeek = data[week - 1];
              const percentGain = prevWeek && prevWeek.damage !== 0
                ? ((damage - prevWeek.damage) / prevWeek.damage) * 100
                : null;
              
              const Dot = ({ bgcolor }) => (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor,
                    flexShrink: 0,
                  }}
                />
              );

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
                    Week {week}
                  </Typography>

                  {sortedMembers.map((member, index) => {
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
                          <Dot bgcolor={memberColors.toReversed()[index]} />

                          <Typography variant='body2'>
                            {CHARACTER[gameId][member.id].name}:
                          </Typography>
                        </Box>

                        <Typography variant='body2'>
                          {formatNum(toDps(sumRotationDmg(weeklySummaries[week], { ownerId: member.id })))}
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

                  {percentGain != null && (
                    <Typography variant="body2" sx={{ color: percentGain >= 0 ? 'success.main' : 'error.main' }}>
                      {percentGain >= 0 ? '+' : ''}{percentGain.toFixed(1)}%
                    </Typography>
                  )}
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
            label="Rating"
            tip="Your team's total damage as a percentage of the team benchmark. Reflects how your character's current build contributes relative to the team's expected optimum."
          />

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h4" sx={{ color: gradeColor, fontWeight: 'bold' }}>
              {grade}
            </Typography>

            <Typography variant="body1" sx={{ color: gradeColor, opacity: 0.7 }}>
              ({scaledBuildRating.toFixed()}%)
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box>
          <InfoLabel
            label="Team DPS"
            tip="The team's total damage for one rotation divided by the time it takes to execute."
          />

          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {formatNum(userDps)}
          </Typography>
        </Box>

        <Box>
          <InfoLabel
            label="Benchmark"
            tip="Sum of each character's simulated average damage at the benchmark week."
          />

          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {formatNum(benchmarkDps)}
          </Typography>
        </Box>
      </Stack>
    </FlexCard>
  );
};
