import { Paper } from '@mui/material';
import Plot from 'react-plotly.js';
import { getPercentile } from '@utils';

const NUM_BINS = 50;

export default ({ gameId, stat, index, ratingData }) => {
  const { rolls, max, dataset } = ratingData;
  const percentile = getPercentile(rolls, dataset);
  const downsampled = dataset.filter((_, index) => {
    return index % 10 === 0 || index === dataset.length - 1;
  });
  const percentileData = downsampled.map((_, index) => {
    return ((index + 1) / downsampled.length) * 100;
  });

  // Calculate histogram data
  const dataMin = Math.min(...dataset);
  const dataMax = Math.max(...dataset);
  const binSize = (dataMax - dataMin) / NUM_BINS;

  const bins = Array(NUM_BINS).fill(0);
  dataset.forEach(rolls => {
    const binIndex = Math.min(Math.floor((rolls - dataMin) / binSize), NUM_BINS - 1);
    bins[binIndex]++;
  });

  // Scale the histogram to match percentile range (0-100)
  const maxCount = Math.max(...bins);
  const scaledBins = bins.map(count => (count / maxCount) * 100);
  const binCenters = Array(NUM_BINS).fill(0).map((_, i) =>
    dataMin + (i + 0.5) * binSize
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Plot
        data={[
          {
            x: downsampled,
            y: percentileData,
            type: 'scatter',
            mode: 'lines',
          },
          {
            x: binCenters,
            y: scaledBins,
            type: 'bar',
            opacity: 0.3,
            marker: { color: 'grey' },
          },
          {
            x: [rolls],
            y: [percentile],
            type: 'scatter',
            mode: 'markers',
            marker: { color: 'red', size: 10 },
          }
        ]}
        layout={{
          width: 500,
          height: 300,
          xaxis: {
            title: { text: 'Weighted Rolls', font: { color: 'grey' } },
            tickfont: { color: 'grey' },
            gridcolor: 'rgba(100, 100, 100, 0.4)',
            range: [Math.min(dataMin, rolls), Math.max(dataMax, rolls)],
            autorange: false,
            dtick: 1,
          },
          yaxis: {
            title: { text: 'Percentile', font: { color: 'grey' } },
            tickfont: { color: 'grey' },
            gridcolor: 'rgba(100, 100, 100, 0.4)',
            range: [0, 100.5],
            tickvals: [0, 25, 50, 75, 100],
          },
          showlegend: false,
          paper_bgcolor: 'rgba(0, 0, 0, 0)',
          plot_bgcolor: 'rgba(0, 0, 0, 0)',
          margin: { t: 10, b: 40, l: 40, r: 10 }
        }}
        config={{ staticPlot: true }}
      />
    </Paper>
  );
};
