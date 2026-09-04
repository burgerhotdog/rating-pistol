import { Card, CardContent, CardHeader, Paper, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useAccent } from '@/hooks';
import { formatNum, formatStr } from '@/utils';

const SkillLevelsAnalysisTab = ({ results }) => {
  const { userDps, skillLevelResults } = results;
  const { palette } = useTheme();
  const accent = useAccent();

  const data = skillLevelResults
    .map(({ skillId, isMax, dps }) => {
      return {
        name: formatStr(skillId),
        dps: isMax ? userDps : dps,
        diff: isMax ? 0 : ((dps / userDps) - 1) * 100,
        ...(isMax && { opacity: 0.5 }),
      };
    })
    .toSorted((a, b) => b.dps - a.dps);

  console.log(data);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader title="Team DPS from increasing skill level by 1" />
      <CardContent component={Stack} sx={{ flex: 1 }}> 
        <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
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
                const { isMax, dps = 0, diff = 0 } = payload?.[0]?.payload ?? {};
                if (isMax) return;

                return (
                  <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      {label}
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                      <Typography variant="caption">
                        {formatNum(dps)} dps
                      </Typography>
                      <Typography variant="caption" color="success">
                        (+{diff.toFixed(1)}%)
                      </Typography>
                    </Stack>
                  </Paper>
                );
              }}
              cursor={{ fill: alpha(palette.text.primary, 0.1) }}
              isAnimationActive={false}
            />
          </BarChart>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SkillLevelsAnalysisTab;
