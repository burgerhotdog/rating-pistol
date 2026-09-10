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
    () => skillLevelResults
      .map(({ skillId, isMax, dps, newLevel }) => ({
        name: formatStr(skillId),
        newLevel,
        isMax: Boolean(isMax),
        dps: isMax ? userDps : dps,
        diff: isMax ? 0 : ((dps / userDps) - 1) * 100,
        ...(isMax && { opacity: 0.5, filter: 'grayscale(1)' }),
      }))
      .toSorted((a, b) => (a.isMax - b.isMax) || (b.dps - a.dps)),
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
        return { ...entry, staminaCost: stamina, rate };
      })
      .toSorted((a, b) => (a.isMax - b.isMax) || (b.rate - a.rate)),
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
          <CardHeader title="Team DPS after increasing skill level by 1" />
          <SkillLevelsAnalysisCharts data={improvementData} />
        </Card>

        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Stamina Cost to upgrade skill level" />
          <UpgradeCosts data={costData} />
        </Card>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <RatePerStamina data={rateData} />
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
