import { useParams } from 'react-router-dom';
import { Chip, CardContent, Box, CardHeader, Card, Divider, Stack, Typography, Skeleton, Avatar } from '@mui/material';
import { MISC, CHARACTERS, WEAPONS, SETS } from '@/data';
import { computeTotalStat, compileStatMap, mergeStatMaps } from '@/utils';
import { CustomAvatar } from '@/components';
import { useBuild } from '@/contexts';
import { TeamMemberDialog } from '@/components/TeamMemberDialog';
import { useState } from 'react';

function constructBuffMap(buffs, buffTypes) {
  if (!buffs) return {};
  const sources = buffTypes.map(type => buffs?.[type]?.constant).filter(Boolean);
  return mergeStatMaps(...sources);
}

function formatBuffStat(gameId, menuStats, statId, value) {
  const abilityTypes = MISC[gameId]?.ABILITY_TYPES ?? {};
  const formatSigned = (num) => `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;

  if (statId.startsWith('PERCENT_')) {
    const key = statId.slice(8);
    const label = menuStats[key]?.label ?? abilityTypes[key] ?? key;
    return `${label} ${formatSigned(value * 100)}`;
  }

  if (statId.startsWith('FLAT_')) {
    const key = statId.slice(5);
    const label = menuStats[key]?.label ?? abilityTypes[key] ?? key;
    return `${label} ${value >= 0 ? '+' : ''}${value.toFixed(0)}`;
  }

  if (statId.startsWith('AMP_')) {
    const key = statId.slice(4);
    const label = abilityTypes[key] ?? key;
    return `Amplify ${label} ${formatSigned(value * 100)}`;
  }

  if (statId.startsWith('SHRED_')) {
    const key = statId.slice(6);
    const label = abilityTypes[key] ?? key;
    return `Shred ${label} ${formatSigned(value * 100)}`;
  }

  if (statId.startsWith('IGNORE_')) {
    const key = statId.slice(7);
    const label = abilityTypes[key] ?? key;
    return `Ignore ${label} ${formatSigned(value * 100)}`;
  }

  return `${statId} ${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
}

function getBuffLines(gameId, menuStats, buffMap) {
  const entries = Object.entries(buffMap).filter(([_, value]) => value !== 0);
  if (!entries.length) return [];

  return entries
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([statId, value]) => formatBuffStat(gameId, menuStats, statId, value));
}

export const StatsPanel = ({ team, updateTeam }) => {
  const { gameId, characterId } = useParams();
  const build = useBuild().getBuilds(gameId)[characterId];
  const { MENU_STATS } = MISC[gameId];
  const [dialogIndex, setDialogIndex] = useState(null);

  const statMap = build ? compileStatMap(gameId, characterId, build, [], "menu") : {};
  const characterIndex = team.findIndex(({ memberId }) => memberId === characterId);
  const isFirst = characterIndex === 0;

  const teamBuffRows = team.flatMap((member, index) => {
    const memberId = member.memberId;
    if (!memberId || memberId === characterId) return [];

    const memberData = CHARACTERS[gameId]?.[memberId];
    if (!memberData) return [];

    const isNext = (characterIndex === team.length - 1)
      ? index === 0
      : index === characterIndex + 1;
    const memberBuffTypes = ["ally", "team", ...(isFirst ? ["first"] : []), ...(isNext ? ["next"] : [])];

    const elementColor = MISC[gameId]?.ELEMENT_COLORS?.[memberData.element] ?? 'text.primary';
    const labelPrefix = memberData.name ?? memberId;
    const characterIcon = `${gameId}/character/${memberId}.webp`;

    const configuredWeaponId = typeof member === 'object' ? member?.weaponId : null;
    const presetWeaponId = memberData.preset?.weaponId;
    const memberWeaponId = configuredWeaponId ?? presetWeaponId;
    const weaponData = memberWeaponId ? WEAPONS[gameId]?.[memberWeaponId] : null;

    const setBonuses = Object.entries(member.setCounts) ?? memberData.preset?.setBonuses ?? [];

    const rows = [];

    const characterBuffLines = getBuffLines(
      gameId,
      MENU_STATS,
      constructBuffMap(memberData.buffs, memberBuffTypes),
    );
    rows.push(...characterBuffLines.map(line => ({
      color: elementColor,
      iconSrc: characterIcon,
      text: `${labelPrefix}: ${line}`,
    })));

    if (weaponData?.buffs) {
      const weaponBuffLines = getBuffLines(
        gameId,
        MENU_STATS,
        constructBuffMap(weaponData.buffs, memberBuffTypes),
      );
      const weaponIcon = `${gameId}/weapon/${memberWeaponId}.webp`;
      rows.push(...weaponBuffLines.map(line => ({
        color: elementColor,
        iconSrc: weaponIcon,
        text: `${weaponData.name ?? 'Weapon'}: ${line}`,
      })));
    }

    for (const [setIdRaw, numPiecesRaw] of setBonuses) {
      const setId = String(setIdRaw);
      const numPieces = Number(numPiecesRaw);
      if (!setId || !Number.isFinite(numPieces)) continue;

      const setData = SETS[gameId]?.[setId];
      const setBuffLines = getBuffLines(
        gameId,
        MENU_STATS,
        constructBuffMap(setData?.setBonus?.[String(numPieces)]?.buffs, memberBuffTypes),
      );
      const setIcon = `${gameId}/set/${setId}.webp`;
      rows.push(...setBuffLines.map(line => ({
        color: elementColor,
        iconSrc: setIcon,
        text: `${setData?.name ?? setId} ${numPieces}pc: ${line}`,
      })));
    }

    return rows;
  });

  if (!build) {
    return (
      <Card sx={{ width: 300 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
        />
      </Card>
    )
  }

  return (
    <Card sx={{ width: 300 }}>
      <CardHeader
        avatar={<CustomAvatar gameId={gameId} characterId={characterId} />}
        title={CHARACTERS[gameId]?.[characterId]?.name ?? ""}
        subheader={
          <Chip
            label={CHARACTERS[gameId]?.[characterId]?.element ?? ""}
            variant="outlined"
            size="small"
            sx={{
              color: MISC[gameId]?.ELEMENT_COLORS[CHARACTERS[gameId]?.[characterId]?.element]
            }}
          />
        }
      />

      <CardContent>
        <Stack gap={1}>
          {Object.entries(MENU_STATS).map(([id, { label, isPercent }]) => {
            const totalValue = computeTotalStat(id, statMap);
            const displayValue = isPercent ? totalValue * 100 : totalValue;
            const toFixedValue = isPercent || (gameId === 'zenless-zone-zero' && id === 'ER') ? 1 : 0;
            if (id !== 'EM' && displayValue === 0) return;
            return (
              <Box
                key={id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {displayValue.toFixed(toFixedValue) + (isPercent ? '%' : '')}
                </Typography>
              </Box>
            );
          })}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
          Team Configuration
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="center">
          {team.map((member, index) => (
            <Box key={index} sx={{ cursor: 'pointer' }} onClick={() => setDialogIndex(index)}>
              <CustomAvatar
                gameId={gameId}
                characterId={member?.memberId ?? null}
              />
            </Box>
          ))}
        </Stack>

        {dialogIndex !== null && (
          <TeamMemberDialog
            gameId={gameId}
            member={team[dialogIndex]}
            team={team}
            open={dialogIndex !== null}
            onClose={() => setDialogIndex(null)}
            onSave={(updatedMember) => updateTeam(dialogIndex, updatedMember)}
          />
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Team Buffs
        </Typography>
        {teamBuffRows.length ? (
          <Stack gap={0.5}>
            {teamBuffRows.map((row, idx) => (
              <Stack key={idx} direction="row" spacing={0.75} alignItems="center">
                <Avatar
                  variant="rounded"
                  src={row.iconSrc}
                  sx={{ width: 16, height: 16 }}
                />
                <Typography variant="caption" sx={{ color: row.color, display: 'block' }}>
                  {row.text}
                </Typography>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography variant="caption" color="text.secondary">
            No active team buffs.
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary">
          Last Updated: {build?.lastUpdated ?? 'Unknown'}
        </Typography>
      </CardContent>
    </Card>
  );
};
