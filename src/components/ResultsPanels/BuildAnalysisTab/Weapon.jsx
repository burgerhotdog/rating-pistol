import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Bar,
  BarChart,
  LabelList,
  Rectangle,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useData } from '@/hooks';
import { formatDmg, formatNum, getDefaultWeapRank } from '@/utils';

// only R1/R5 dps samples exist, so bucket the user's real rank to whichever was simulated
const bucketWeaponRank = (rank) => (rank >= 3 ? 5 : 1);

const limitWeapons = (entries, weapDatas, userWeaponId) => {
  let freePicked = false;
  let standardPicked = false;
  const limits = { 3: 1, 4: 3, 5: 3 };
  const counts = { 3: 0, 4: 0, 5: 0 };
  const picked = entries.filter(({ weaponId }) => {
    const { quality, standard, free } = weapDatas[weaponId];
    if (free && !freePicked) {
      freePicked = true;
      return true;
    }
    if (standard && !standardPicked) {
      standardPicked = true;
      return true;
    }
    if (!limits[quality] || counts[quality] >= limits[quality]) {
      return false;
    }
    counts[quality]++;
    return true;
  });

  // guarantee the user's own weapon is always visible so it can be highlighted
  const hasUserWeapon = picked.some(({ weaponId }) => weaponId === userWeaponId);
  if (userWeaponId != null && !hasUserWeapon) {
    const userEntry = entries.find(({ weaponId }) => weaponId === userWeaponId);
    if (userEntry) picked.push(userEntry);
  }

  return picked.sort((a, b) => b.dps - a.dps);
};

function buildData(gameId, weapDatas, weaponResults, userDps, userMember) {
  const dataEntries = Object.entries(weaponResults)
    .map(([id, [dpsR1, dpsR5]]) => {
      const weaponId = Number(id);
      const isUser = weaponId === userMember?.weaponId;
      const weaponRank = isUser ? userMember.weaponRank : getDefaultWeapRank(gameId, id);
      const sampleRank = isUser ? bucketWeaponRank(userMember.weaponRank) : weaponRank;
      return {
        weaponId,
        weaponRank,
        dps: sampleRank === 5 ? dpsR5 : dpsR1,
        isUser,
      };
    })
    .sort((a, b) => b.dps - a.dps);

  const limitedEntries = limitWeapons(dataEntries, weapDatas, userMember?.weaponId);

  return limitedEntries.map(({ weaponId, weaponRank, dps, isUser }) => {
    return {
      weaponId,
      weaponRank,
      name: `${weapDatas[weaponId].name} R${weaponRank}`,
      icon: `${gameId}/weapon/${weaponId}.webp`,
      dps,
      pct: (dps / userDps) * 100,
      isUser,
    };
  });
}

function buildFullData(gameId, weapDatas, weaponResults, userDps, userMember) {
  const userSampleRank = userMember ? bucketWeaponRank(userMember.weaponRank) : null;

  const dataEntries = Object.entries(weaponResults)
    .flatMap(([id, [dpsR1, dpsR5]]) => [
      { weaponId: Number(id), weaponRank: 5, dps: dpsR5 },
      { weaponId: Number(id), weaponRank: 1, dps: dpsR1 },
    ])
    .sort((a, b) => b.dps - a.dps);

  return dataEntries.map(({ weaponId, weaponRank, dps }) => {
    const isUser = weaponId === userMember?.weaponId && weaponRank === userSampleRank;
    return {
      weaponId,
      weaponRank,
      name: `${weapDatas[weaponId].name} R${weaponRank}`,
      icon: `${gameId}/weapon/${weaponId}.webp`,
      dps,
      pct: (dps / userDps) * 100,
      isUser,
    };
  });
}

const renderTooltip = ({ payload, label }) => {
  const { dps = 0, pct = 0, isUser } = payload?.[0]?.payload ?? {};
  const diff = pct - 100;
  const diffStr = diff > 0
    ? `+${diff.toFixed(1)}`
    : diff.toFixed(1);

  return (
    <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
      <Typography variant="caption" color="textSecondary">
        {label}
      </Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="caption">
          {formatNum(dps)} dps
        </Typography>
        {!isUser && (
          <Typography
            variant="caption"
            color={diff > 0 ? 'success' : 'error'}
          >
            ({diffStr}%)
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

const Weapon = ({ results }) => {
  const { weaponResults, userDps, userMember } = results;
  const { gameId } = useParams();
  const { palette, qualityColors } = useTheme();
  const weapDatas = useData('weapon');
  const [open, setOpen] = useState(false);

  const data = buildData(gameId, weapDatas, weaponResults, userDps, userMember);
  const fullData = buildFullData(gameId, weapDatas, weaponResults, userDps, userMember);

  const tickFormatter = (v) => formatDmg(v);

  const barShape = (props) => {
    const { weaponId, isUser, ...rest } = props;
    const { quality } = weapDatas[weaponId];

    return (
      <Rectangle
        {...rest}
        fill={`url(#gradient${quality})`}
        style={!isUser ? { filter: 'brightness(0.5)' } : undefined}
      />
    );
  };

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title="Weapons"
        action={
          <Button
            onClick={() => setOpen(true)}
          >
            View all
          </Button>
        }
      />

      <CardContent component={Stack} sx={{ flex: 1 }}>
        <BarChart
          data={data}
          style={{ width: '100%', height: '100%' }}
          responsive
        >
          <defs>
            {Object.entries(qualityColors).map(([q, qColor]) => (
              <linearGradient key={q} id={`gradient${q}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={qColor} stopOpacity={1} />
                <stop offset="100%" stopColor={qColor} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          <XAxis
            type="category"
            dataKey="name"
            tick={false}
          />

          <YAxis
            type="number"
            tickFormatter={tickFormatter}
          />

          <Bar
            dataKey="dps"
            shape={barShape}
          >
            <LabelList
              content={({ x, y, width, height, index }) => {
                const entry = data[index];
                if (!entry?.icon) return null;

                const size = width - 16;
                const ix = x + 8;
                const iy = y + height - size - 8;

                return (
                  <image
                    x={ix}
                    y={iy}
                    width={size}
                    height={size}
                    href={entry.icon}
                    xlinkHref={entry.icon}
                    opacity={!entry.isUser
                      ? 0.5
                      : undefined
                    }
                    style={!entry.isUser
                      ? { filter: 'brightness(0.5)' }
                      : undefined
                    }
                  />
                );
              }}
            />
          </Bar>

          <Tooltip
            content={renderTooltip}
            cursor={{ fill: alpha(palette.text.primary, 0.1) }}
            isAnimationActive={false}
          />
        </BarChart>
      </CardContent>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        fullWidth
        slotProps={{
          paper: {
            elevation: 2,
          },
        }}
      >
        <DialogTitle>
          All Weapons
        </DialogTitle>

        <DialogContent sx={{ height: '80vh' }}>
          <BarChart
            data={fullData}
            style={{ width: '100%', height: '100%' }}
            responsive
          >
            <XAxis
              type="category"
              dataKey="name"
              tick={false}
            />

            <YAxis
              type="number"
              tickFormatter={tickFormatter}
            />

            <Bar
              dataKey="dps"
              shape={barShape}
            >
              <LabelList
                content={({ x, y, width, height, index }) => {
                  const entry = fullData[index];
                  if (!entry?.icon) return null;

                  const size = width - 8;
                  const ix = x + 4;
                  const iy = y + height - size - 4;

                  return (
                    <image
                      x={ix}
                      y={iy}
                      width={size}
                      height={size}
                      href={entry.icon}
                      xlinkHref={entry.icon}
                      opacity={!entry.isUser
                        ? 0.5
                        : undefined
                      }
                      style={!entry.isUser
                        ? { filter: 'brightness(0.5)' }
                        : undefined
                      }
                    />
                  );
                }}
              />
            </Bar>

            <Tooltip
              content={renderTooltip}
              cursor={{ fill: alpha(palette.text.primary, 0.1) }}
              isAnimationActive={false}
            />
          </BarChart>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Weapon;
