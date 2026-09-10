import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, Stack } from '@mui/material';
import { useAccent, useData } from '@/hooks';
import { computeStaminaToUpgradeSkill, formatStr } from '@/utils';
import SkillLevelsAnalysisCharts from './SkillLevelsAnalysisCharts';
import UpgradeCosts from './UpgradeCosts';
import RatePerStamina from './RatePerStamina';

const SkillLevels = ({ results }) => {
  const { userDps, skillLevelResults } = results;
  const { gameId } = useParams();
  const accent = useAccent();
  const { skillLevelUpgradeCosts } = useData('misc');

  const improvementData = useMemo(
    () => Object.values(skillLevelResults)
      .map(({ skillId, isMax, dpsArr, baseLevel }) => ({
        name: formatStr(skillId),
        newLevel: baseLevel + 1,
        isMax: Boolean(isMax),
        dps: isMax ? userDps : dpsArr[0],
        diff: isMax ? 0 : ((dpsArr[0] / userDps) - 1) * 100,
        fill: `url(#gradientAccent)`,
        ...(isMax && { opacity: 0.5, filter: 'grayscale(1)' }),
      })),
    [skillLevelResults, userDps],
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
          <CardHeader title="Team DPS after increasing skill level by 1" />
          <SkillLevelsAnalysisCharts data={improvementData} />
        </Card>
      </Stack>

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id={`gradientAccent`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity={1} />
            <stop offset="100%" stopColor={accent} stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
    </Stack>
  );
};

export default SkillLevels;
