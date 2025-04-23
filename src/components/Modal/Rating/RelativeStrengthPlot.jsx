import React from 'react';
import Plot from 'react-plotly.js';

const calculateMean = (scores) => {
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
};

const calculatePercentile = (scores, score) => {
  const countBelow = scores.filter(s => s < score).length;
  return (countBelow / scores.length) * 100;
};

const RelativeStrengthPlot = ({ percentile, score, simScores }) => {
  const mean = calculateMean(simScores);

  const relativeStrength = simScores.map(score => ({
    percentile: calculatePercentile(simScores, score),
    meanStrength: score / mean,
  }));

  return (
    <Plot
      data={[{
        x: relativeStrength.map(rs => rs.percentile),
        y: relativeStrength.map(rs => rs.meanStrength),
        type: "scatter",
        mode: "lines+markers",
        name: "Relative to Mean",
      }]}
      layout={{
        title: 'Relative Strength of Scores',
        xaxis: {
          title: {
            text: 'Percentile',
            font: { color: "grey" },
          },
          tickfont: { color: "grey" },
          gridcolor: "grey",
        },
        yaxis: {
          title: {
            text: "Relative Strength",
            font: { color: "grey" },
          },
          tickfont: { color: "grey" },
          gridcolor: "grey",
        },
        shapes: [{
          type: "line",
          x0: percentile,
          x1: percentile,
          y0: 0,
          y1: 1,
          yref: "paper",
          line: { color: "red", width: 2 },
        }],
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        plot_bgcolor: "rgba(0, 0, 0, 0)",
      }}
      config={{ responsive: true, staticPlot: true }}
    />
  );
};

export default RelativeStrengthPlot;