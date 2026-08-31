import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
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
import { useAccent, useData } from '@/hooks';
import { getDefaultWeapRank } from '@/utils';

function getDpsIndex(gameId, weapId) {
  const rank = getDefaultWeapRank(gameId, weapId);
  return rank === 5 ? 1: 0;
}

function buildData(gameId, weapData, weaponResults, userDps, userMember) {
  const dataEntries = Object.entries(weaponResults)
    .sort(([aId, aDps], [bId, bDps]) => {
      const aIndex = getDpsIndex(gameId, aId);
      const bIndex = getDpsIndex(gameId, bId);
      return bDps[bIndex] - aDps[aIndex];
    });

  const refIndex = getDpsIndex(gameId, dataEntries[0][0]);
  const maxDps = dataEntries[0][1][refIndex];

  return dataEntries.map(([weaponId, dps]) => {
    const pctDps = dps[getDpsIndex(gameId, weaponId)];
    return {
      weaponId,
      quality: weapData[weaponId].quality,
      name: weapData[weaponId].name,
      icon: `${gameId}/weapon/${weaponId}.webp`,
      equipped: weaponId === userMember.weaponId,
      dps,
      dpsR1: dps[0],
      dpsR5: Math.max(dps[1] - dps[0], 0.001),
      pct: (pctDps / userDps) * 100,
      opacity: (pctDps / maxDps) ** 2,
    };
  });
}

const Set = ({ results }) => {
  const { weaponResults, userDps, userMember } = results;
  const { gameId } = useParams();
  const { palette, qualityColors } = useTheme();
  const accent = useAccent();
  const weapons = useData('weapon');

  const data = buildData(gameId, weapons, weaponResults, userDps, userMember);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader title="Set Comparisons" />
      <CardContent component={Stack} sx={{ flex: 1 }}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ right: 32 }}
          style={{ width: '100%', height: '100%' }}
          responsive
        >
          <XAxis
            type="number"
            tickFormatter={(v) => v.toFixed()}
          />

          <YAxis
            type="category"
            dataKey="name"
            tick={false}
            axisLine={false}
          />

          <Bar
            dataKey="dpsR1"
            stackId="a"
            shape={(props) => {
              const { index, ...rest } = props;
              const entry = data[index];
              return <Rectangle {...rest} fill={accent} fillOpacity={entry.opacity} />;
            }}
          />

          <Bar
            dataKey="dpsR5"
            stackId="a"
            shape={(props) => {
              const { index, ...rest } = props;
              const entry = data[index];
              return <Rectangle {...rest} fill={qualityColors[entry.quality]} fillOpacity={0.5} />;
            }}
          >
            <LabelList
              content={({ x, y, width, height, index }) => {
                const entry = data[index];
                if (!entry?.icon) return null;

                const size = height;
                const ix = x + width + 8;
                const iy = y;

                return (
                  <g>
                    {entry.equipped && (
                      <rect
                        x={ix - 2}
                        y={iy - 2}
                        width={size + 4}
                        height={size + 4}
                        rx={4}
                        fill={alpha(palette.primary.main, 0.15)}
                        stroke={palette.primary.main}
                      />
                    )}

                    <image
                      x={ix}
                      y={iy}
                      width={size}
                      height={size}
                      href={entry.icon}
                      xlinkHref={entry.icon}
                    />
                  </g>
                );
              }}
            />
          </Bar>

          <Tooltip
            content={({ payload, label }) => {
              const { dps = [] } = payload?.[0]?.payload ?? {};
              return (
                <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
                  <Typography variant="caption">
                    {label}: {(dps[0] ?? 0).toFixed()} - {(dps[1] ?? 0).toFixed()}
                  </Typography>
                </Paper>
              );
            }}
            cursor={{ fill: alpha(palette.text.primary, 0.1) }}
            isAnimationActive={false}
          />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default Set;
