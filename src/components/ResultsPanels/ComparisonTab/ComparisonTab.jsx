import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, CardHeader, FormControlLabel, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAccent, useData } from '@/hooks';
import { Switch } from '../../Colored';
import WeaponsChart from './WeaponsChart';
import SetBonusesChart from './SetBonusesChart';

const ComparisonTab = ({ results }) => {
  const { weaponResults, userDps, userMember } = results;
  const { charId } = useParams();
  const { qualityColors } = useTheme();
  const accent = useAccent();
  const { memberPreset } = useData('character')[charId];
  const weapDatas = useData('weapon');

  const [open, setOpen] = useState(false);
  const [showOtherSig, setShowOtherSig] = useState(false);
  
  const userWeaponId = userMember.weaponId;
  const signatureWeaponId = memberPreset?.weaponId;

  const data = useMemo(
    () => weaponResults
      .toSorted((a, b) => b.dps - a.dps)
      .map(({ weaponId, weaponRank, dps }) => {
        const { name, icon, quality } = weapDatas[weaponId];
        const isUser = weaponId === userWeaponId;

        return {
          weaponId,
          weaponRank,
          name: `${name} R${weaponRank}`,
          icon,
          dps,
          pct: (dps / userDps) * 100,
          isUser,
          fill: `url(#gradient${quality})`,
          ...(!isUser && { filter: 'brightness(0.5)' }),
        };
      })
      .filter(({ weaponId }) => {
        const weapData = weapDatas[weaponId];
        if (weapData.quality < 5) return true;

        if (
          weaponId === signatureWeaponId ||
          weaponId === userWeaponId ||
          weapData.standard
        ) return true;

        return showOtherSig;
      }),
    [weapDatas, weaponResults, userWeaponId, userDps, signatureWeaponId, showOtherSig],
  );

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Card component={Stack} sx={{ flex: 1 }}>
        <CardHeader
          title="Weapons"
          action={
            <FormControlLabel
              control={
                <Switch
                  color={accent}
                  checked={showOtherSig}
                  onChange={(e) => setShowOtherSig(e.target.checked)}
                />
              }
              label="Show other signatures"
            />
          }
        />
        <WeaponsChart data={data} />
      </Card>

      <Card component={Stack} sx={{ flex: 1 }}>
        <CardHeader
          title="Set Bonuses" 
          action={
            <Button onClick={() => setOpen(true)}>
              View all
            </Button>
          }
        />
        <SetBonusesChart
          results={results}
          open={open}
          onClose={() => setOpen(false)}
        />
      </Card>

      <svg width="0" height="0">
        <defs>
          <linearGradient id={`accentGradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity={1} />
            <stop offset="100%" stopColor={accent} stopOpacity={0} />
          </linearGradient>
          {Object.entries(qualityColors).map(([q, qColor]) => (
            <linearGradient key={q} id={`gradient${q}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={qColor} stopOpacity={1} />
              <stop offset="100%" stopColor={qColor} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
      </svg>
    </Stack>
  );
};

export default ComparisonTab;
