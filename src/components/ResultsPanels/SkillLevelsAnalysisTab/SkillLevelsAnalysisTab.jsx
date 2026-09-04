import { Card, CardContent, CardHeader, Paper, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useAccent, useData } from '@/hooks';
import { formatNum, formatStr } from '@/utils';

const SkillLevelsAnalysisTab = ({ results }) => {
  const { userDps, skillLevelResults } = results;
  const { palette } = useTheme();
  const { skillLevelUpgradeCosts, domains } = useData('misc');
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

      let staminaCost = 0;
      let moneyAcc = 0;

      const weeklyDomainTimes = upgradeCosts.weekly / domains.weekly.reward.weekly;
      staminaCost += weeklyDomainTimes * domains.weekly.stamina;
      moneyAcc += weeklyDomainTimes * domains.weekly.reward.money;

      const materialDomainTimes = upgradeCosts.material / domains.material.reward.material;
      staminaCost += materialDomainTimes * domains.material.stamina;
      moneyAcc += materialDomainTimes * domains.material.reward.money;

      const moneyStillNeeded = Math.max(upgradeCosts.money - moneyAcc, 0);
      const moneyDomainTimes = moneyStillNeeded / domains.money.reward.money;
      staminaCost += moneyDomainTimes * domains.money.stamina;

      const rate = diff / staminaCost;
      return { ...entry, staminaCost, rate };
    })
    .toSorted((a, b) => (a.isMax - b.isMax) || (b.rate - a.rate));

  return (
    <Stack spacing={1}>
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
          </Stack>
        </CardContent>
      </Card>

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
    </Stack>
  );
};

export default SkillLevelsAnalysisTab;
