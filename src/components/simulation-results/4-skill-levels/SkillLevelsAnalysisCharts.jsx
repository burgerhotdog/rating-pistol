import { useMemo } from 'react';
import { Paper, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Bar, BarChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { useData } from '@/hooks';
import { formatStr } from '@/utils';

const SkillLevelsAnalysisCharts = ({ results }) => {
  const { userDps, skillLevelResults } = results;
  const { palette } = useTheme();
  const { maxSkillLevel } = useData('misc');

  const data = useMemo(
    () => Object.values(skillLevelResults)
      .map(({ skillId, dpsArr, userLevel }) => {
        const pctOfBase = (dps) => (dps / dpsArr[0] - 1) * 100;

        return {
          name: formatStr(skillId),
          userLevel,
          userValue: pctOfBase(userDps),
          ...Object.fromEntries(
            dpsArr.slice(1).map((dps, i) => [i + 2, pctOfBase(dps)])
          ),
        };
      }),
    [skillLevelResults, userDps],
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
            const { userValue } = payload;

            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="url(#gradientAccent)"
                rx={2}
                {...(value > userValue && {
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
