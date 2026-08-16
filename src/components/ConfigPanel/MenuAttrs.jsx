import { useParams } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { GI, HSR, WW, ZZZ } from '@/data';
import { compileMenuMap, formatAttr, formatStr, getAttr } from '@/utils';

const ATTR_ROWS = {
  [GI]: [
    'hp',
    'atk',
    'def',
    'elementalMastery',
    'critRate%',
    'critDmg%',
    'healingBonus%',
    'energyRecharge%'
  ],
  [HSR]: [
    'hp',
    'atk',
    'def',
    'spd',
    'critRate%',
    'critDmg%',
    'breakEffect%',
    'outgoingHealingBoost%',
    'energyRegenerationRate%',
    'effectHitRate%',
    'effectRes%'
  ],
  [WW]: [
    'hp',
    'atk',
    'def',
    'energyRegen%',
    'critRate%',
    'critDmg%'
  ],
  [ZZZ]: [
    'hp',
    'atk',
    'def',
    'impact',
    'critRate%',
    'critDmg%',
    'anomalyMastery',
    'anomalyProficiency',
    'penRatio%',
    'energyRegen'
  ],
};

export const MenuAttrs = ({ team = [] }) => {
  const { gameId, charId } = useParams();

  const member = team.find((member) => member.id === charId);
  const menuMap = compileMenuMap(gameId, charId, member);
  const data = ATTR_ROWS[gameId].map((attr) => {
    const attrValue = getAttr(attr, menuMap);
    return {
      label: formatStr(attr),
      value: formatAttr(gameId, attr, attrValue),
    };
  });

  return (
    <Stack sx={{ flex: 1 }}>
      {data.map(({ label, value }) => (
        <Stack key={label}
          direction="row"
          sx={{ justifyContent: 'space-between' }}
        >
          <Typography variant="body2" color="textSecondary">
            {label}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
