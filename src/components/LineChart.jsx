import { Box, Card, Divider, Paper, Stack, ToggleButton, ToggleButtonGroup, Tooltip as MuiTooltip, Typography } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { ResponsiveContainer, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { CHARACTERS, MISC } from "@/data";

const InfoLabel = ({ label, tip }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    <Typography variant="overline" color="text.secondary" lineHeight={1.4}>{label}</Typography>
    <MuiTooltip title={tip} placement="top" arrow>
      <HelpOutlineIcon sx={{ fontSize: 13, color: 'text.disabled', cursor: 'help' }} />
    </MuiTooltip>
  </Box>
);

export const CustomLineChart = ({ weeklyScores, weeklyDistribution, rating, isLoading, gameId, characterId, teamWeeklyScores }) => {
  const theme = useTheme();
  const disabledColor = theme.palette.action.disabled;
  const element = CHARACTERS[gameId]?.[characterId]?.element;
  const elementColor = MISC[gameId]?.ELEMENT_COLORS?.[element] ?? '#8884d8';
  const [viewMode, setViewMode] = useState('team');

  if (isLoading || !weeklyScores) return null;

  const hasTeamData = teamWeeklyScores && Object.keys(teamWeeklyScores).length > 0;
  const showTeam = viewMode === 'team' && hasTeamData;

  // Teammate benchmark damage at final week (constant contribution)
  const teammatesBenchmark = hasTeamData
    ? Object.values(teamWeeklyScores).reduce((sum, scores) => sum + (scores[scores.length - 1] ?? 0), 0)
    : 0;

  // Team totals: main char's weekly scores + teammates' fixed benchmark damage
  const teamScores = hasTeamData
    ? weeklyScores.map(score => score + teammatesBenchmark)
    : null;

  const activeScores = showTeam ? teamScores : weeklyScores;
  const benchmarkRating = activeScores[activeScores.length - 1];
  const activeUserRating = showTeam ? (rating ?? 0) + teammatesBenchmark : (rating ?? 0);
  const scaledBuildRating = activeUserRating / benchmarkRating * 100;

  const data = activeScores.map((dmg, index) => {
    const dist = weeklyDistribution?.[index];
    return {
      week: index,
      damage: dmg,
      q1: showTeam ? dmg : (dist?.q1 ?? dmg),
      iqr: showTeam ? 0 : (dist ? dist.q3 - dist.q1 : 0),
      p10: showTeam ? dmg : (dist?.p10 ?? dmg),
      p90band: showTeam ? 0 : (dist ? dist.p90 - dist.p10 : 0),
    };
  });
  const yMin = 0;
  const distMax = (!showTeam && weeklyDistribution) ? Math.max(...weeklyDistribution.map(d => d.p90)) : 0;
  const yMax = Math.max(benchmarkRating, activeUserRating, distMax) * 1.08;

  const formatDamage = (v) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return v.toFixed(0);
  };

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
            <linearGradient id="gradientRating" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={disabledColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={disabledColor} stopOpacity={0.02} />
            </linearGradient>
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
            label={{ value: 'Damage', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />

          <ReferenceLine
            y={benchmarkRating}
            stroke={disabledColor}
            strokeDasharray="6 3"
            strokeOpacity={0.5}
            label={{
              value: `Benchmark`,
              position: 'insideTopRight',
              fill: disabledColor,
              fontSize: 11,
            }}
          />

          <ReferenceLine
            y={activeUserRating}
            stroke={elementColor}
            strokeWidth={2}
            label={{
              value: `You · ${scaledBuildRating.toFixed(1)}%`,
              position: activeUserRating > benchmarkRating * 0.9 ? 'insideBottomRight' : 'right',
              fill: elementColor,
              fontSize: 12,
              fontWeight: 600,
            }}
          />

          {/* P10–P90 outer band */}
          <Area type="monotone" dataKey="p10" stackId="outer" stroke="none" fill="transparent" activeDot={false} />
          <Area type="monotone" dataKey="p90band" stackId="outer" stroke="none" fill={disabledColor} fillOpacity={0.06} activeDot={false} />

          {/* IQR inner band */}
          <Area type="monotone" dataKey="q1" stackId="band" stroke="none" fill="transparent" activeDot={false} />
          <Area type="monotone" dataKey="iqr" stackId="band" stroke="none" fill={disabledColor} fillOpacity={0.14} activeDot={false} />

          {/* Mean line */}
          <Area
            type="monotone"
            dataKey="damage"
            stroke={disabledColor}
            strokeWidth={2}
            fill="url(#gradientRating)"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, fill: theme.palette.background.paper }}
          />
          
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;

              const { week, damage } = payload[0].payload;
              const prevWeek = data[week - 1];
              const percentGain =
                prevWeek && prevWeek.damage !== 0
                  ? ((damage - prevWeek.damage) / prevWeek.damage) * 100
                  : null;
              const dist = weeklyDistribution?.[week];

              return (
                <Paper
                  elevation={4}
                  sx={{
                    p: 1.5,
                    minWidth: 140,
                    backgroundColor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Week {week}
                  </Typography>
                  <Typography variant="body2">
                    Avg: {damage.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </Typography>
                  {!showTeam && dist && (
                    <Typography variant="body2" color="text.secondary">
                      Q1–Q3: {dist.q1.toLocaleString('en-US', { maximumFractionDigits: 0 })} – {dist.q3.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </Typography>
                  )}
                  {percentGain != null && (
                    <Typography variant="body2" color={percentGain >= 0 ? 'success.main' : 'error.main'}>
                      {percentGain >= 0 ? '+' : ''}{percentGain.toFixed(2)}% vs prev
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
      <Stack spacing={1.5} sx={{ flex: 1, p: 2, minWidth: 150, justifyContent: 'center' }}>
        {hasTeamData && (
          <>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, val) => { if (val) setViewMode(val); }}
              size="small"
              fullWidth
            >
              <ToggleButton value="solo">
                <MuiTooltip title="Solo view" placement="top" arrow>
                  <PersonIcon fontSize="small" />
                </MuiTooltip>
              </ToggleButton>
              <ToggleButton value="team">
                <MuiTooltip title="Team view" placement="top" arrow>
                  <GroupsIcon fontSize="small" />
                </MuiTooltip>
              </ToggleButton>
            </ToggleButtonGroup>
            <Divider />
          </>
        )}
        <Box>
          <InfoLabel
            label="Potential"
            tip={showTeam
              ? "Your team's total damage as a percentage of the team benchmark. Reflects how your character's current build contributes relative to the team's expected optimum."
              : "Your build's damage as a percentage of the benchmark. Above 100% means your build exceeds the expected stopping point."}
          />
          <Typography variant="h5" fontWeight="bold" color={scaledBuildRating >= 100 ? 'success.main' : 'warning.main'}>
            {scaledBuildRating.toFixed(1)}%
          </Typography>
        </Box>
        <Divider />
        <Box>
          <InfoLabel
            label={showTeam ? "Team Score" : "Your Score"}
            tip={showTeam
              ? "Your character's current damage plus teammates' simulated benchmark damage."
              : "Total calculated damage for your current build's rotation."}
          />
          <Typography variant="h6" fontWeight="bold">
            {activeUserRating?.toLocaleString('en-US', { maximumFractionDigits: 0 }) ?? '—'}
          </Typography>
        </Box>
        <Box>
          <InfoLabel
            label={showTeam ? "Team Benchmark" : "Benchmark"}
            tip={showTeam
              ? "Sum of each character's simulated average damage at the benchmark week."
              : "Average damage of simulated builds at the week where farming becomes resin-inefficient (<1% weekly gain)."}
          />
          <Typography variant="h6" fontWeight="bold">
            {benchmarkRating?.toLocaleString('en-US', { maximumFractionDigits: 0 }) ?? '—'}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};
