import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useAccent, useData } from '@/hooks';
import { computeStaminaToUpgradeSkill } from '@/utils';
import SkillLevelsAnalysisCharts from './SkillLevelsAnalysisCharts';
import UpgradeCosts from './UpgradeCosts';
import RatePerStamina from './RatePerStamina';

const SkillLevelsAnalysisTab = ({ results }) => {
  const { gameId } = useParams();
  const { skillLevelUpgradeCosts } = useData('misc');
  const accent = useAccent();

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
        <SkillLevelsAnalysisCharts results={results} />
        <UpgradeCosts data={costData} />
      </Stack>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <RatePerStamina results={results} />
        <UpgradeCosts data={costData} />
      </Stack>

      <svg width="0" height="0">
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

export default SkillLevelsAnalysisTab;
