import { useMemo } from 'react';
import { Box, Card, Tooltip, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTheme } from '@mui/material/styles';
import { CHARACTERS, WEAPONS, MISC } from '@/data';
import { computeDamage } from '@/utils';

export const WeaponCompare = ({ gameId, characterId, build, calcs, team }) => {
  const theme = useTheme();
  const element = CHARACTERS[gameId]?.[characterId]?.element;
  const elementColor = MISC[gameId]?.ELEMENT_COLORS?.[element] ?? '#8884d8';

  const results = useMemo(() => {
    if (!build || !calcs) return [];

    const currentWeapon = WEAPONS[gameId][build.weaponId];
    if (!currentWeapon) return [];

    const weaponType = currentWeapon.type;
    const currentDamage = computeDamage(gameId, characterId, build, calcs, team);

    return Object.entries(WEAPONS[gameId])
      .filter(([, w]) => w.type === weaponType && Number(w.quality) >= 4)
      .map(([weaponId, weapon]) => {
        const testBuild = { ...build, weaponId };
        const damage = computeDamage(gameId, characterId, testBuild, calcs, team);
        const diff = ((damage - currentDamage) / currentDamage) * 100;
        return {
          weaponId,
          name: weapon.name,
          quality: Number(weapon.quality),
          damage,
          diff,
          isCurrent: weaponId === build.weaponId,
        };
      })
      .sort((a, b) => b.damage - a.damage)
      .slice(0, 8);
  }, [gameId, characterId, build, calcs, team]);

  if (!results.length) return null;

  const maxDamage = results[0]?.damage ?? 1;

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 2, pt: 1.5, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">Weapon Comparison</Typography>
        <Tooltip title="Estimated damage with alternative weapons, keeping your current artifacts. Helps decide if a weapon switch is worth it." placement="top" arrow>
          <HelpOutlineIcon sx={{ fontSize: 13, color: 'text.disabled', cursor: 'help' }} />
        </Tooltip>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto', px: 2, pb: 1.5 }}>
        {results.map(({ weaponId, name, quality, diff, isCurrent, damage }) => {
          const barWidth = (damage / maxDamage) * 100;
          const qualityColor = theme.palette.rarityColor?.[quality] ?? theme.palette.text.primary;
          return (
            <Box key={weaponId} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.25 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: qualityColor,
                    fontWeight: isCurrent ? 700 : 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    mr: 1,
                  }}
                >
                  {name}{isCurrent ? ' ✦' : ''}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isCurrent ? 'text.secondary' : diff > 0 ? 'success.main' : diff < 0 ? 'error.main' : 'text.secondary',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isCurrent ? 'current' : `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'action.hover',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${barWidth}%`,
                    borderRadius: 2,
                    backgroundColor: isCurrent ? elementColor : 'action.disabled',
                    opacity: isCurrent ? 1 : 0.5,
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
};
