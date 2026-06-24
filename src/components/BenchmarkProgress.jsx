import { useParams } from 'react-router-dom';
import { Box, Card, Divider, Paper, Stack, Tooltip as MuiTooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { ResponsiveContainer, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { CHARACTER } from '@/data';
import { sumRotationDmg } from '@/utils';

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
      color="text.secondary"
      sx={{ lineHeight: 1.4 }}
    >
      {label}
    </Typography>

    <MuiTooltip
      title={tip}
      placement="top"
      arrow
    >
      <HelpOutlineOutlinedIcon
        sx={{
          fontSize: 13,
          color: 'text.disabled',
          cursor: 'help',
        }}
      />
    </MuiTooltip>
  </Box>
);

const formatDamage = (v) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toFixed(0);
};

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

export const BenchmarkProgress = ({ weeklySummaries, weeklyDistribution, team, userSummary, cache }) => {
  const theme = useTheme();
  const { gameId } = useParams();
  const disabledColor = theme.palette.action.disabled;

  if (!weeklySummaries) return null;

  const members = team.filter(m => m.id);
  const membersMisc = [
    ...members,
    ...(Object.values(weeklySummaries[0]).some(result => result.ownerId === 'misc') ? [{ id: 'misc' }] : []),
  ];

  const memberColors = membersMisc.map(m => {
    if (m.id === 'misc') return '#ffffff';
    const el = CHARACTER[gameId][m.id].element;

    return theme.accentColors[gameId][el] ?? disabledColor;
  });

  const rotationTime = cache.fullRotationTime;
  const toDps = dmg => rotationTime > 0 ? dmg / rotationTime * 1000 : 0;
  const memberRotationTimeMap = Object.fromEntries(
    members.map((m) => [m.id, cache.member[m.id]?.rotationTime])
  );

  const activeScores = weeklySummaries.map(actionMap => toDps(sumRotationDmg(actionMap)));
  const benchmarkRating = activeScores[activeScores.length - 1];
  const activeUserRating = toDps(sumRotationDmg(userSummary ?? {}));
  const scaledBuildRating = activeUserRating / benchmarkRating * 100;

  const data = activeScores.map((dmg, index) => {
    const dist = weeklyDistribution[index];
    const entry = {
      week: index,
      damage: dmg,
      p10: toDps(dist.p10.damage) ?? dmg,
      p90band: dist ? toDps(dist.p90.damage) - toDps(dist.p10.damage) : 0,
    };

    for (const m of membersMisc) {
      entry[`dps_${m.id}`] = toDps(sumRotationDmg(weeklySummaries[index], { ownerId: m.id }));
    }

    return entry;
  });

  const yMin = 0;
  const distMax = weeklyDistribution ? Math.max(...weeklyDistribution.map(d => toDps(d.p90.damage))) : 0;
  const yMax = Math.max(benchmarkRating, activeUserRating, distMax) * 1.08;

  const { grade, color: gradeColor } = getGrade(scaledBuildRating);

  return (
    <Card sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
      <Box sx={{ flex: 3, minWidth: 0, position: 'relative' }}>
        <Box sx={{ position: 'absolute', inset: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
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

          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />

          <XAxis
            dataKey="week"
            tick={{ fontSize: 12 }}
            label={{ value: 'Weeks', position: 'insideBottomRight', offset: -5, fontSize: 12 }}
          />

          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 12 }}
            tickFormatter={formatDamage}
            label={{ value: 'DPS', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />

          <ReferenceLine
            y={activeUserRating}
            strokeWidth={2}
          />

          {/* P10–P90 outer band */}
          <Area type="monotone" dataKey="p10" stackId="outer" stroke="none" fill="transparent" activeDot={false} />
          <Area type="monotone" dataKey="p90band" stackId="outer" stroke="none" fill={disabledColor} fillOpacity={0.2} activeDot={false} />

          {/* Stacked member DPS areas */}
          {membersMisc.map((m, i) => (
            <Area
              key={m.id}
              type="monotone"
              dataKey={`dps_${m.id}`}
              stackId="members"
              stroke={memberColors[i]}
              strokeWidth={1.5}
              fill={`url(#gradientMember${i})`}
              activeDot={false}
            />
          ))}
          
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;

              const { week, damage } = payload[0].payload;
              const prevWeek = data[week - 1];
              const percentGain = prevWeek && prevWeek.damage !== 0
                ? ((damage - prevWeek.damage) / prevWeek.damage) * 100
                : null;
              const dist = weeklyDistribution[week];

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

                  {membersMisc.map((m, i) => (
                    <Box key={m.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: memberColors[i], flexShrink: 0 }} />
                      <Typography variant="body2">
                        {CHARACTER[gameId][m.id]?.name ?? m.id}:{' '}
                        {sumRotationDmg(weeklySummaries[week], { ownerId: m.id }).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        {m.id !== 'misc' && (
                          <>
                            {' / '}
                            {((memberRotationTimeMap[m.id] ?? 0) / 1000).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}s
                          </>
                        )}
                      </Typography>
                    </Box>
                  ))}

                  <Divider sx={{ my: 0.5 }} />

                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Total: {damage.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </Typography>

                  {dist && (
                    <Typography variant="body2" color="textSecondary">
                      p10-p90: {toDps(dist.p10.damage).toLocaleString('en-US', { maximumFractionDigits: 0 })} - {toDps(dist.p90.damage).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </Typography>
                  )}

                  {percentGain != null && (
                    <Typography variant="body2" sx={{ color: percentGain >= 0 ? 'success.main' : 'error.main' }}>
                      {percentGain >= 0 ? '+' : ''}{percentGain.toFixed(1)}% vs prev
                    </Typography>
                  )}
                </Paper>
              );
            }}
          />
        </ComposedChart>
        </ResponsiveContainer>
        </Box>
      </Box>

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

            <Typography variant="body1" fontWeight="medium" sx={{ color: gradeColor, opacity: 0.7 }}>
              ({scaledBuildRating.toFixed(1)}%)
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box>
          <InfoLabel
            label="Team DPS"
            tip="Your character's current damage plus teammates' simulated benchmark damage."
          />

          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {activeUserRating?.toLocaleString('en-US', { maximumFractionDigits: 0 }) ?? '—'}
          </Typography>
        </Box>

        <Box>
          <InfoLabel
            label="Benchmark"
            tip="Sum of each character's simulated average damage at the benchmark week."
          />

          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {benchmarkRating?.toLocaleString('en-US', { maximumFractionDigits: 0 }) ?? '—'}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};
