import { Paper } from '@mui/material';
import Plot from 'react-plotly.js';
import daysToFarm from './daysToFarm';

export default ({ gameId, stat, index, ratingData }) => {
  const { percentile, rolls, dataset } = ratingData;
  const downsampled = dataset.filter((_, index) =>
    index % 10 === 0 || index === dataset.length - 1
  );
  
  // Add the score point to the line if it's not already included
  const lineData = [...downsampled];
  if (!lineData.includes(rolls)) {
    lineData.push(rolls);
    lineData.sort((a, b) => a - b);
  }

  const percentileData = lineData.map((_, index) => ((index + 1) / lineData.length) * 100);

  const daysData = percentileData.map((percentile) => {
    return daysToFarm(gameId, percentile, stat, index);
  });
  
  // Calculate histogram data manually
  const numBins = 50;
  const min = Math.min(...dataset);
  const max = Math.max(...dataset);
  const binSize = (max - min) / numBins;
  
  const bins = Array(numBins).fill(0);
  dataset.forEach(rolls => {
    const binIndex = Math.min(Math.floor((rolls - min) / binSize), numBins - 1);
    bins[binIndex]++;
  });

  // Scale the histogram to match percentile range (0-100)
  const maxCount = Math.max(...bins);
  const scaledBins = bins.map(count => (count / maxCount) * 100);
  const binCenters = Array(numBins).fill(0).map((_, i) =>
    min + (i + 0.5) * binSize
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Plot
        data={[
          {
            x: lineData,
            y: percentileData,
            type: 'scatter',
            mode: 'lines',
          },
          {
            x: lineData,
            y: daysData,
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
            range: [0, Math.max(max, rolls)],
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
