import { useMemo } from 'react';
import { Paper, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Bar, BarChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { useAccent, useData } from '@/hooks';
import { formatStr } from '@/utils';

const SkillLevelsAnalysisCharts = ({ results, costData }) => {
  const { userDps, skillLevelResults } = results;
  const { palette } = useTheme();
  const accent = useAccent();
  const { maxSkillLevel } = useData('misc');

  const data = useMemo(
    () => Object.values(skillLevelResults)
      .map(({ skillId, dpsArr, userLevel }) => {
        const pctOfBase = (dps) => (dps / dpsArr[0] - 1) * 100;

        const bars = Object.fromEntries(
          dpsArr.slice(1).map((dps, i) => [i + 2, pctOfBase(dps)])
        )

        let thresholdValue = pctOfBase(dpsArr[1]);
        for (const { level, stamina } of costData) {
          const improvement = bars[level];
          const prevImprovement = bars[level - 1] ?? 0;
          const rate = ((improvement + 100) / (prevImprovement + 100) - 1) * 100 / stamina;
          if (rate > 0.004) {
            thresholdValue = improvement;
          }
        }

        return {
          name: formatStr(skillId),
          userLevel,
          userValue: pctOfBase(userDps),
          thresholdValue,
          ...bars,
        };
      }),
    [skillLevelResults, userDps, costData],
  );

  return (
    <BarChart
      data={data}
      style={{ width: '100%', height: '100%' }}
      responsive
    >
      <XAxis
        dataKey="name"
        tick={{ fontSize: 11 }}
      />

      <YAxis
        type="number"
        domain={[0, 'dataMax']}
        tickFormatter={(t) => `+${t.toFixed()}%`}
      />

      {Array.from({ length: maxSkillLevel - 1 }).map((_, i) => (
        <Bar
          key={i + 2}
          dataKey={i + 2}
          shape={({ x, y, width, height, value, payload }) => {
            const { userValue, thresholdValue } = payload;

            const isOverUser = value > userValue;
            const isOverThreshold = value > thresholdValue;

            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={isOverUser ? 'none' : 'url(#gradientAccent)'}
                stroke={isOverUser ? accent : 'none'}
                rx={2}
                {...(isOverThreshold && {
                  filter: 'grayscale(1)',
                })}
              />
            );
          }}
        />
      ))}

      <ReferenceLine y={0} opacity={0.5} />

      <Tooltip
        content={({ payload, label }) => {
          if (!payload?.[0]?.payload) return;
          const { userLevel } = payload[0].payload;

          return (
            <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
              <Typography variant="body2" color="textSecondary">
                {label}
              </Typography>
              <Typography variant="body2">
                Level {userLevel}
              </Typography>
            </Paper>
          );
        }}
        cursor={{ fill: alpha(palette.text.primary, 0.1) }}
        isAnimationActive={false}
      />
    </BarChart>
  );
};

export default SkillLevelsAnalysisCharts;
