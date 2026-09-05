import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent, FormControlLabel, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAccent, useData } from '@/hooks';
import { Switch } from '../../Colored';
import ComparisonChart from './ComparisonChart';

const WeaponTab = ({ results }) => {
  const { weaponResults, userDps, userMember } = results;
  const { charId } = useParams();
  const { qualityColors } = useTheme();
  const accent = useAccent();
  const { memberPreset } = useData('character')[charId];
  const weapDatas = useData('weapon');

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
        <CardHeader title="Weapon Comparison" />
        <CardContent>
        </CardContent>
      </Card>

      <Card component={Stack} sx={{ flex: 1 }}>
        <CardHeader
          title=""
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
        <ComparisonChart data={data} />
      </Card>

      <svg width="0" height="0">
        <defs>
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

export default WeaponTab;
