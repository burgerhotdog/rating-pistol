import React from 'react';
import Plot from 'react-plotly.js';

const PercentilePlot = ({ scores, score }) => {
  const countBelow = scores.filter(s => s < score).length;
  const percentile = (countBelow / scores.length) * 100;

  return (
    <Plot
      data={[
        {
          x: scores,
          type: 'histogram',
          marker: {
            color: 'rgba(55, 128, 191, 0.7)',
          },
        },
      ]}
      layout={{
        shapes: [{
          type: "line",
          x0: score,
          x1: score,
          y0: 0,
          y1: 1,
          line: { color: "red", width: 2 },
          yref: "paper",
        }],
        annotations: [{
          x: score,
          y: 1,
          yref: "paper",
          text: `Your Score (${percentile.toFixed(0)}th Percentile)`,
          font: { color: "white" },
          ax: 0,
          ay: -20,
          bgcolor: "rgba(0, 0, 0, 0.5)",
          borderpad: 4,
        }],
        title: `Score Percentile: ${percentile.toFixed(2)}%`,
        xaxis: { title: { text: 'Scores' } },
        yaxis: { title: { text: 'Frequency' } },
        barmode: 'overlay',
      }}
    />
  );
};

export default PercentilePlot;