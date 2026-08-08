import {
  AreaChart as Area,
  BarChart as Bar,
  ComposedChart as Composed,
  PieChart as Pie,
  RadarChart as Radar,
  ScatterChart as Scatter,
} from 'recharts';

function createResponsiveChart(Chart) {
  const ResponsiveChart = (props) => (
    <Chart
      responsive
      width="100%"
      height="100%"
      {...props}
    />
  );
  return ResponsiveChart;
}

export const AreaChart = createResponsiveChart(Area);
export const BarChart = createResponsiveChart(Bar);
export const ComposedChart = createResponsiveChart(Composed);
export const PieChart = createResponsiveChart(Pie);
export const RadarChart = createResponsiveChart(Radar);
export const ScatterChart = createResponsiveChart(Scatter);
