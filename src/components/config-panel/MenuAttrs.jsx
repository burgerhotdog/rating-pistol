import { Stack, Typography } from '@mui/material';
import { CHARACTER, WEAPON, SET, ECHO, GI, HSR, WW, ZZZ } from '@/data';
import { usePageParams } from '@/hooks';
import {
  buildBaseMap,
  buildEquipMap,
  formatAttr,
  formatStr,
  getAttr,
  getMemberCounts,
  isEnabled,
  resolveRankedValue,
  toArray,
  toMergedObj,
} from '@/utils';

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

const isStaticBuff = (effect) => (
  effect.buff?.stats &&
  !effect.buff?.filter &&
  !effect.apply
);

const appliesToCharId = (effect, charId) =>
  !effect.stores ||
  toArray(effect.stores).some((store) => ['global', '$team', charId].includes(store));


function buildMenuMap(gameId, charId, team, spec = {}) {
  const member = team.find((member) => member?.id === charId);

  const baseMap = spec.baseMap ?? buildBaseMap(gameId, charId, member.weaponId);
  const equipMap = spec.equipMap ?? buildEquipMap(member.build?.equipList ?? []);
  const memberIds = team.filter((member) => member?.id).map((member) => member.id);
  const counts = getMemberCounts(gameId, memberIds);

  // Static buffs from effects
  const effectMaps = [];

  const charData = CHARACTER[gameId][charId];
  for (const effect of charData.effects ?? []) {
    if (
      (
        effect.rank > 0 && member.rank < effect.rank ||
        effect.rank < 0 && member.rank >= -effect.rank
      ) ||
      effect.mode && effect.mode !== member.mode ||
      !isEnabled(gameId, effect, charId, counts) ||
      !isStaticBuff(effect) ||
      !appliesToCharId(effect, charId)
    ) continue;

    effectMaps.push(effect.buff.stats);
  }

  const weapData = WEAPON[gameId][member.weaponId] ?? {};
  if (weapData.type === charData.type) {
    for (const effect of weapData.effects ?? []) {
      if (
        !isEnabled(gameId, effect, charId, counts) ||
        !isStaticBuff(effect) ||
        !appliesToCharId(effect, charId)
      ) continue;

      const resolvedMap = {};
      for (const [stat, value] of Object.entries(effect.buff.stats)) {
        resolvedMap[stat] = Array.isArray(value)
          ? resolveRankedValue(value, member.weaponRank)
          : value;
      }

      effectMaps.push(resolvedMap);
    }
  }

  const allSetEffects = Object.entries(member.setCounts).flatMap(([setId, pieces]) =>
    SET[gameId][setId].effects.filter(({ bonus }) => bonus <= pieces)
  );
  for (const effect of allSetEffects) {
    if (
      !isEnabled(gameId, effect, charId, counts) ||
      !isStaticBuff(effect) ||
      !appliesToCharId(effect, charId)
    ) continue;

    effectMaps.push(effect.buff.stats);
  }

  if (gameId === WW) {
    const echoData = ECHO[member.mainEcho] ?? {};
    for (const effect of echoData.effects ?? []) {
      if (
        !isEnabled(gameId, effect, charId, counts) ||
        !isStaticBuff(effect) ||
        !appliesToCharId(effect, charId)
      ) continue;

      effectMaps.push(effect.buff.stats);
    }
  }

  return toMergedObj(baseMap, equipMap, ...effectMaps);
}

const MenuAttrs = ({ team }) => {
  const { gameId, charId } = usePageParams();
  const menuMap = buildMenuMap(gameId, charId, team);
  const rows = ATTR_ROWS[gameId].map((attr) => {
    const attrValue = getAttr(attr, menuMap);
    return {
      label: formatStr(attr),
      value: formatAttr(gameId, attr, attrValue),
    };
  });

  return (
    <Stack sx={{ flex: 1 }}>
      {rows.map(({ label, value }) => (
        <Stack
          key={label}
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

export default MenuAttrs;
