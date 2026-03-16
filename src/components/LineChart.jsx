import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const mockData = [
  { week: 0, damage: 5000 },
  { week: 1, damage: 5300 },
  { week: 2, damage: 5600 },
  { week: 3, damage: 5900 },
  { week: 4, damage: 6150 },
  { week: 5, damage: 6350 },
  { week: 6, damage: 6500 },
  { week: 7, damage: 6650 },
  { week: 8, damage: 6750 },
  { week: 9, damage: 6820 },
  { week: 10, damage: 6880 },
  { week: 11, damage: 6920 },
  { week: 12, damage: 6950 },
  { week: 13, damage: 6970 },
  { week: 14, damage: 6985 },
  { week: 15, damage: 6995 },
  { week: 16, damage: 7000 },
  { week: 17, damage: 7005 },
  { week: 18, damage: 7010 },
  { week: 19, damage: 7015 },
  { week: 20, damage: 7020 },
];

export const CustomLineChart = () => {
  return (
    <LineChart
      width={800}
      height={400}
      data={mockData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="week" label={{ value: 'Weeks', position: 'insideBottomRight', offset: -5 }} />
      <YAxis label={{ value: 'Damage', angle: -90, position: 'insideLeft' }} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="damage" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
};
