import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, darken, useTheme } from '@mui/material/styles';
import {
  Bar,
  Cell,
  LabelList,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart } from '@/components';
import { useWeapData, useElementColors } from '@/hooks';

const Weapon = ({ weaponResults, userDps, userMember }) => {
  const { gameId } = useParams();
  const { palette } = useTheme();
  const weapData = useWeapData();
  const color = useElementColors({ char: '$curr' });

  const { weaponId, weaponRank } = userMember;

  const dataEntries = Object.entries(weaponResults).sort(([, [a]], [, [b]]) => b - a);

  const data = dataEntries.map(([weaponId, dps]) => ({
    weaponId,
    name: weapData[weaponId].name,
    icon: `${gameId}/weapon/${weaponId}.webp`,
    dps,
    dpsR1: dps[0],
    dpsR5: dps[1],
    pct: (dps[0] / userDps) * 100,
  }));

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader title="Weapon Rankings" />
      <CardContent component={Stack} sx={{ flex: 1 }}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ right: 32 }}
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

          <RechartsTooltip
            cursor={{ fill: alpha(palette.text.primary, 0.04) }}
            content={({ payload, label }) => {
              const { dps = [], pct = 0 } = payload?.[0]?.payload ?? {};
              return (
                <Card elevation={4} sx={{ minWidth: 180 }}>
                  <CardContent>
                    <Typography variant="subtitle2">
                      {label}
                    </Typography>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
                      <Typography variant="body2">
                        {(dps[0] ?? 0).toFixed()} - {(dps[1] ?? 0).toFixed()}
                      </Typography>
                      <Typography variant="body2">
                        {pct.toFixed(1)}%
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              );
            }}
          />

          <Bar dataKey="dpsR1">
            {data.map((entry) => (
              <Cell
                key={entry.weaponId}
                fill={color}
              />
            ))}

            <LabelList
              content={({ x, y, width, height, index }) => {
                const icon = data[index]?.icon;
                if (!icon) return null;
                const size = height;
                return (
                  <image
                    x={x + width + 8}
                    y={y}
                    width={size}
                    height={size}
                    href={icon}
                    xlinkHref={icon}
                  />
                );
              }}
            />
          </Bar>
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default Weapon;
