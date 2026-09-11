import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAccent, useData } from '@/hooks';
import { computeStaminaToUpgradeSkill, formatStr } from '@/utils';
import SkillLevelsAnalysisCharts from './SkillLevelsAnalysisCharts';
import UpgradeCosts from './UpgradeCosts';
import RatePerStamina from './RatePerStamina';

const SkillLevels = ({ results }) => {
  const { userDps, skillLevelResults } = results;
  const { gameId } = useParams();
  const { palette } = useTheme();
  const accent = useAccent();
  const { maxSkillLevel, skillLevelUpgradeCosts } = useData('misc');

  const improvementData = useMemo(
    () => Object.values(skillLevelResults)
      .map(({ skillId, dpsArr, userLevel }) => ({
        name: formatStr(skillId),
        newLevel: userLevel + 1,
        isMax: userLevel === maxSkillLevel,
        dps: userLevel === maxSkillLevel ? userDps : dpsArr[userLevel],
        diff: userLevel === maxSkillLevel ? 0 : ((dpsArr[userLevel] / userDps) - 1) * 100,
        fill: `url(#gradientAccent)`,
        ...(userLevel === maxSkillLevel && {
          opacity: 0.5,
          filter: 'grayscale(1)',
        }),
      })),
    [skillLevelResults, maxSkillLevel, userDps],
  );

  const rateData = useMemo(
    () => improvementData
      .map((entry) => {
        const { isMax, diff, newLevel } = entry;
        if (isMax) return entry;

        const upgradeCosts = skillLevelUpgradeCosts[newLevel - 2];
        const stamina = computeStaminaToUpgradeSkill(gameId, upgradeCosts);
        const rate = diff / stamina;
        return {
          ...entry,
          staminaCost: stamina,
          rate,
        };
      }),
    [improvementData, gameId, skillLevelUpgradeCosts],
  );

  const costData = useMemo(
    () => skillLevelUpgradeCosts.map((upgradeCosts, i) => ({
      ...upgradeCosts,
      stamina: computeStaminaToUpgradeSkill(gameId, upgradeCosts),
      level: i + 2,
      fill: `url(#gradientAccent)`,
    })),
    [skillLevelUpgradeCosts, gameId],
  );

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Current rate of improvement per stamina" />
          <RatePerStamina data={rateData} />
        </Card>

        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Stamina Cost to upgrade skill level" />
          <UpgradeCosts data={costData} />
        </Card>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Δ DPS when increasing skill levels" />
          <SkillLevelsAnalysisCharts results={results} costData={costData} />
        </Card>
      </Stack>

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradientAccent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity={1} />
            <stop offset="100%" stopColor={accent} stopOpacity={0} />
          </linearGradient>

          <linearGradient id="gradientSuccess" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.success.main} stopOpacity={1} />
            <stop offset="100%" stopColor={palette.success.main} stopOpacity={0} />
          </linearGradient>

          <linearGradient id="gradientError" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.error.main} stopOpacity={0} />
            <stop offset="100%" stopColor={palette.error.main} stopOpacity={1} />
          </linearGradient>
        </defs>
      </svg>
    </Stack>
  );
};

export default SkillLevels;
