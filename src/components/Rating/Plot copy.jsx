import { useState, useEffect, useRef } from 'react';
import { Paper } from '@mui/material';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist-min';
import { getPercentile } from '@utils';

const NUM_BINS = 40;

export default ({ rolls, dataset }) => {
  const max = Math.ceil(Math.max(...dataset, rolls) * 10) / 10;
  const binSize = max / NUM_BINS;

  // histogram
  const binCounts = dataset.reduce((acc, item) => {
    const binIndex = Math.min(Math.floor(item / binSize), NUM_BINS - 1);
    acc[binIndex]++;
    return acc;
  }, Array(NUM_BINS).fill(0));
  const binCenters = binCounts.map((_, i) => (i + 0.5) * binSize);
  const maxCount = Math.max(...binCounts);
  const scaledBins = binCounts.map(count => count / maxCount * 100);
  const histogramTrace = {
    x: binCenters,
    y: scaledBins,
    type: 'bar',
    opacity: 0.3,
    marker: { color: 'grey' },
    name: '',
    hoverinfo: 'skip'
  };

  // line
  const lineX = Array.from({ length: max * 10 + 1 }, (_, i) => i * 0.1);
  const lineY = lineX.map(value => getPercentile(value, dataset));
  // const downsampled = dataset.filter((_, i) => i % 25 === 0 || i === dataset.length - 1);
  // const percentileData = downsampled.map((_, i) => (i + 1) / downsampled.length * 100);
  const lineTrace = {
    x: lineX,
    y: lineY,
    type: 'scatter',
    mode: 'lines',
    name: '',
    hovertemplate: 'Rolls: %{x:.1f}, Percentile: %{y:.1f}<extra></extra>',
  };

  // point
  const percentile = getPercentile(rolls, dataset);
  const pointTrace = {
    x: [rolls],
    y: [percentile],
    type: 'scatter',
    mode: 'markers',
    marker: { color: 'red', size: 10 },
    name: '',
    hovertemplate: 'Rolls: %{x:.1f}, Percentile: %{y:.1f}<extra></extra>',
  };

  // animate
  const plotRef = useRef(null);
  const [plotEl, setPlotEl] = useState(null);
  
  useEffect(() => {
    if (!plotEl) return;

    Plotly.animate(plotEl, {
      data: [
        { x: binCenters, y: scaledBins },
        { x: lineX, y: lineY },
        { x: [rolls], y: [percentile] },
      ],
      traces: [0, 1, 2],
    }, {
      transition: { duration: 500, easing: 'cubic-in-out' },
      frame: { duration: 1000 }
    });

    Plotly.relayout(plotEl, { 'xaxis.range': [0, max] });
  }, [dataset, plotEl]);

  return (
    <Paper sx={{ p: 3 }}>
      <Plot
        ref={plotRef}
        data={[histogramTrace, lineTrace, pointTrace]}
        layout={{
          width: 500,
          height: 300,
          xaxis: {
            title: { text: 'Weighted Rolls', font: { color: 'grey' } },
            tickfont: { color: 'grey' },
            gridcolor: 'rgba(100, 100, 100, 0.4)',
            range: [0, max],
            autorange: false,
            dtick: 1,
            fixedrange: true,
          },
          yaxis: {
            title: { text: 'Percentile', font: { color: 'grey' } },
            tickfont: { color: 'grey' },
            gridcolor: 'rgba(100, 100, 100, 0.4)',
            range: [0, 100.5],
            dtick: 25,
            fixedrange: true,
          },
          showlegend: false,
          paper_bgcolor: 'rgba(0, 0, 0, 0)',
          plot_bgcolor: 'rgba(0, 0, 0, 0)',
          margin: { t: 10, b: 40, l: 40, r: 10 }
        }}
        config={{ displayModeBar: false }}
        onInitialized={(figure, graphDiv) => setPlotEl(graphDiv)}
      />
    </Paper>
  );
};
