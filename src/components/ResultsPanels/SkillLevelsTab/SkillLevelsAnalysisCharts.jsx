import { Paper, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useAccent } from '@/hooks';
import { formatNum, formatStr } from '@/utils';

const SkillLevelsAnalysisCharts = ({ results }) => {
  const { userDps, skillLevelResults } = results;
  const { palette } = useTheme();
  const accent = useAccent();

  const data = skillLevelResults
    .map(({ skillId, isMax, dps, newLevel }) => {
      return {
        name: formatStr(skillId),
        newLevel,
        isMax: Boolean(isMax),
        dps: isMax ? userDps : dps,
        diff: isMax ? 0 : ((dps / userDps) - 1) * 100,
        ...(isMax && { opacity: 0.5, filter: 'grayscale(1)' }),
      };
    })
    .toSorted((a, b) => (a.isMax - b.isMax) || (b.dps - a.dps));

  return (
    <BarChart
      data={data}
      layout="vertical"
      style={{ width: '100%', height: '100%' }}
      responsive
    >
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
      <Bar dataKey="dps" fill={accent} />
      <Tooltip
        content={({ payload, label }) => {
          const { isMax, dps = 0, diff = 0, newLevel } = payload?.[0]?.payload ?? {};
          if (isMax) return;

          return (
            <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
              <Typography variant="body2" color="textSecondary">
                {`${label} ${newLevel - 1} > ${newLevel}`}
              </Typography>
              <Stack direction="row" spacing={0.5}>
                <Typography variant="body2">
                  {formatNum(dps)} dps
                </Typography>
                {!isMax && (
                  <Typography variant="body2" color="success">
                    (+{Math.abs(diff).toFixed(2)}%)
                  </Typography>
                )}
              </Stack>
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
