import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, Paper, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useAccent, useData } from '@/hooks';
import { computeStaminaToUpgradeSkill, formatStr } from '@/utils';

const RatePerStamina = ({ results }) => {
  const { userDps, skillLevelResults } = results;
  const { gameId } = useParams();
  const { palette } = useTheme();
  const { skillLevelUpgradeCosts } = useData('misc');
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

  const data2 = data
    .map((entry) => {
      const { isMax, diff, newLevel } = entry;
      if (isMax) return entry;

      const upgradeCosts = skillLevelUpgradeCosts[newLevel - 2];
      const stamina = computeStaminaToUpgradeSkill(gameId, upgradeCosts);
      const rate = diff / stamina;
      return { ...entry, staminaCost: stamina, rate };
    })
    .toSorted((a, b) => (a.isMax - b.isMax) || (b.rate - a.rate));

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader title="Improvement rate per stamina" />
      <CardContent component={Stack} sx={{ flex: 1 }}> 
        <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
          <BarChart
            data={data2}
            layout="vertical"
            style={{ width: '100%', height: '100%' }}
            responsive
          >
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
            <Bar dataKey="rate" fill={accent} />
            <Tooltip
              content={({ payload, label }) => {
                if (!payload?.[0]?.payload) return;
                const { isMax, diff, rate, staminaCost, newLevel } = payload[0].payload;
                if (isMax) return;

                return (
                  <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
                    <Typography variant="body2" color="textSecondary">
                      {`${label} ${newLevel - 1} > ${newLevel}`}
                    </Typography>
                    <Stack>
                      <Typography variant="body2">
                        Δ DPS: +{Math.abs(diff).toFixed(2)}%
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Cost: {staminaCost.toFixed()} stamina
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Rate: {rate.toFixed(4)}% per stamina
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

export default RatePerStamina;
