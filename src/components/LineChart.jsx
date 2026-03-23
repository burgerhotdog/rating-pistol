import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceDot } from 'recharts';

export const CustomLineChart = ({ data, damage }) => {
  // Find intersection
  let intersection = null;
  if (data) {
    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const curr = data[i];
      if ((prev.damage < damage && curr.damage >= damage) ||
          (prev.damage > damage && curr.damage <= damage)) {
        // Linear interpolation
        const t = (damage - prev.damage) / (curr.damage - prev.damage);
        const week = prev.week + t * (curr.week - prev.week);
        intersection = { week, damage };
        break;
      }
    }
  }

  return (
    <LineChart
      width={800}
      height={400}
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="week" type="number" label={{ value: 'Weeks', position: 'insideBottomRight', offset: -5 }} />
      <YAxis label={{ value: 'Damage', angle: -90, position: 'insideLeft' }} />
      <Tooltip />
      <Legend />
      {intersection && (
        <ReferenceDot x={intersection.week} y={intersection.damage} fill="red" r={6} />
      )}
      <Line type="monotone" dataKey="damage" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
};
