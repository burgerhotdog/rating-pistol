import { useParams } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { GI, HSR, WW, ZZZ, CHARACTER, WEAPON, SET, ECHO } from '@/data';
import {
  buildBaseMap,
  buildEquipMap,
  formatAttr,
  formatStr,
  getAttr,
  isEnabledChar,
  isEnabledWeap,
  isEnabledSet,
  isEnabledEcho,
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

  // Static buffs from effects
  const effectMaps = [];

  const character = CHARACTER[gameId][charId];
  if (character.effects) {
    const memberIds = team.filter((member) => member?.id).map((member) => member.id);
    for (const effect of character.effects) {
      if (
        !isEnabledChar(effect, member, gameId, memberIds) ||
        !isStaticBuff(effect) ||
        !appliesToCharId(effect, charId)
      ) continue;
      effectMaps.push(effect.buff.stats);
    }
  }

  const weapon = WEAPON[gameId][member.weaponId] ?? {};
  if (weapon.effects) {
    for (const effect of weapon.effects) {
      if (
        !isEnabledWeap(effect, character, weapon) ||
        !isStaticBuff(effect) ||
        !appliesToCharId(effect, charId)
      ) continue;
      const resolvedMap = {};
      for (const [stat, value] of Object.entries(effect.buff.stats)) {
        resolvedMap[stat] = resolveRankedValue(value, member.weaponRank);
      }
      effectMaps.push(resolvedMap);
    }
  }

  const allSetEffects =
    Object.entries(member.setCounts)
      .flatMap(([setId, pcCount]) =>
        SET[gameId][setId].effects.filter((effect) =>
          isEnabledSet(effect, pcCount, character)
        )
      );
  for (const effect of allSetEffects) {
    if (
      !isStaticBuff(effect) ||
      !appliesToCharId(effect, charId)
    ) continue;
    effectMaps.push(effect.buff.stats);
  }

  const echo = ECHO[member.mainEcho] ?? {};
  if (echo.effects) {
    for (const effect of echo.effects) {
      if (
        !isEnabledEcho(effect, character) ||
        !isStaticBuff(effect) ||
        !appliesToCharId(effect, charId)
      ) continue;
      effectMaps.push(effect.buff.stats);
    }
  }

  return toMergedObj(baseMap, equipMap, ...effectMaps);
}

const MenuAttrs = ({ team }) => {
  const { gameId, charId } = useParams();
  const menuMap = buildMenuMap(gameId, Number(charId), team);
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
