import { Paper } from "@mui/material";
import Plot from "react-plotly.js";

export default ({ score, simScores }) => {
  const downsampled = simScores.filter((_, index) => index % 10 === 0);
  
  // Calculate histogram data manually
  const numBins = 50;
  const min = Math.min(...simScores);
  const max = Math.max(...simScores);
  const binSize = (max - min) / numBins;
  
  const bins = Array(numBins).fill(0);
  simScores.forEach(score => {
    const binIndex = Math.min(Math.floor((score - min) / binSize), numBins - 1);
    bins[binIndex]++;
  });
  
  // Scale the histogram to match percentile range (0-100)
  const maxCount = Math.max(...bins);
  const scaledBins = bins.map(count => (count / maxCount) * 100);
  
  const binCenters = Array(numBins).fill(0).map((_, i) => min + (i + 0.5) * binSize);

  return (
    <Paper>
      <Plot
        data={[
          {
            x: downsampled,
            y: downsampled.map((_, index) => ((index + 1) / downsampled.length) * 100),
            type: "scatter",
            mode: "lines",
            name: "Percentile",
          },
          {
            x: binCenters,
            y: scaledBins,
            type: "bar",
            opacity: 0.3,
            marker: { color: "grey" },
            name: "Frequency",
          }
        ]}
        layout={{
          title: {
            text: "Percentile with Frequency Distribution",
            font: { color: "white" },
          },
          xaxis: {
            title: {
              text: "Relative Performance Index",
              font: { color: "grey" },
            },
            tickfont: { color: "grey" },
            gridcolor: "dimgrey",
          },
          yaxis: {
            title: {
              text: "Percentile",
              font: { color: "grey" },
            },
            tickfont: { color: "grey" },
            gridcolor: "dimgrey",
            range: [0, 100.5],
            tickvals: [0, 25, 50, 75, 100],
          },
          shapes: [{
            type: "line",
            x0: score,
            x1: score,
            y0: 0,
            y1: 1,
            yref: "paper",
            line: { color: "red", width: 2 },
          }],
          showlegend: false,
          paper_bgcolor: "rgba(0, 0, 0, 0)",
          plot_bgcolor: "rgba(0, 0, 0, 0)",
        }}
        config={{ staticPlot: true }}
      />
    </Paper>
  );
};
